type TObjectCommon = {
    [index: string]: any
}
type TMapObjectObj = TObjectCommon & {}
type IMapObjectData = TObjectCommon & {}
/**
 *
 * 从对象中取值
 *
 * 可以是简单的取值，也可以生成computed需要的函数式数据，达到类似mapGetters的效果
 * @param keys 要从对象中取的属性，可以对象式配置
 * @param obj 要取值的对象
 * @param returnFunction 是否以函数形式返回
 */
export const mapObject = (keys: (string | Object)[], obj: TMapObjectObj, returnFunction?: boolean) => {
    let attrName: string, valueKey: string
    return keys.reduce<IMapObjectData>((data, k: any) => {
        if (typeof k === "string") attrName = valueKey = k
        else if (typeof k === "object" && k.key && k.alias) {
            attrName = k.alias
            valueKey = k.key
        }
        data[attrName] = returnFunction ? () => obj[valueKey] : obj[valueKey]
        return data
    }, {} as IMapObjectData)
}

/**
 * 对象同步（从A对象同步到B对象，仅保留A中存在的key，且如果在B中存在对应数据，也保留该数据）
 * @example
 *  fromObj: {name: "jack", age: 3}
 *  toObj: {name: "rose"}
 *  -> {name: "rose", age: 3}
 * @param fromObj 源对象
 * @param toObj 目标对象
 */
export const syncObject = (fromObj: TObjectCommon, toObj: TObjectCommon) => {
    const newObj: TObjectCommon = {}
    for (let k in fromObj) {
        newObj[k] = toObj[k] || fromObj[k]
    }
    return newObj
}

/**
 * 链式取值
 * @example obj {use: {age: 12}} chainKeys: "user.age" -> 12
 * @param chainKeys 如`user.age`
 * @param obj 如`{user: {age: 12}}`
 */
export const chainGet = (chainKeys: string, obj: TObjectCommon) => {
    return _chainGet(chainKeys.split(".").reverse(), obj)
}

const _chainGet = (keyList: string[], obj: TObjectCommon): any => {
    const key = keyList.pop() as string
    return keyList.length ? _chainGet(keyList, obj[key]) : obj[key]
}

/**
 * 格式化时间，并不严格遵循java规范
 * * 大写YY,MM,DD为年月日
 * * 小写hh,mm,ss为时分秒
 * * 不区分单双位数
 *
 * 这是一个极简的日期格式化函数，如果需要更高级的格式化，可以考虑使用[moment.js](https://www.npmjs.com/package/moment)
 * @param d 日期对象或字符串
 * @param format 格式化字符串
 */
export const formatDate = (d: Date | string | number, format: string) => {
    d = new Date(d)
    // 获取年月日
    let [year, month, day] = d.toLocaleDateString().split("/")
    month = month.length === 1 ? "0" + month : month
    day = day.length === 1 ? "0" + day : day
    // 获取时分秒
    let hours = d.getHours().toString(), minutes = d.getMinutes().toString(), seconds = d.getSeconds().toString()
    // 前置补零
    if (hours.length === 1) hours = "0" + hours
    if (minutes.length === 1) minutes = "0" + minutes
    if (seconds.length === 1) seconds = "0" + seconds
    // todo replaceAll?
    return format.replace(/Y{4}/, year).replace(/Y{2}/, year.slice(2))
        .replace("MM", month)
        .replace("DD", day)
        .replace("hh", hours).replace("mm", minutes).replace("ss", seconds)
}


type TSelectFileParam = {
    multiple?: boolean
    accept?: string
}
type TSelectFileReturn = Promise<{
    files: FileList
    value: string
} | { file: File, value: string }>
/**
 * 文件选择（仅浏览器）
 * @param multiple 多选（单选时，resolve自动处理单个文件的返回）
 * @param accept  接收类型
 */
export const selectFile = ({multiple = false, accept = ""}: TSelectFileParam): TSelectFileReturn => {
    return new Promise(((resolve, reject) => {
        const input = document.createElement("input")
        input.type = "file"
        input.multiple = multiple
        input.accept = accept
        input.onchange = () => {
            if (input.files?.length) resolve(
                multiple ? {files: input.files, value: input.value} : {file: input.files[0], value: input.value}
            )
            else reject()
        }
        input.click()
    }))
}
/**
 * 字符串（非严格，可能是null等无效内容）转换成数组
 * @param s 要转换的字符串
 * @param separator 分隔符，同String.split参数separator
 * @param popEmpty 是否去除空值
 * @param autoTrim 是否自动trim
 */
export const strToArray = (s: string | null | undefined, separator: string | RegExp = ",", popEmpty = true, autoTrim = false) => {
    s = s || ""
    let ret: string[] = s.split(separator)
    if (popEmpty) ret = ret.filter(s => s)
    if (autoTrim) ret = ret.filter(s => s.trim())
    return ret
}

/**
 * 拼接数组到字符串，主要是用来简便排除
 * @param arr 字符串数组
 * @param separator 拼接符
 * @param ignoreEmpty 排除空字符串
 */
export const arrToString = (arr: (string | number)[], separator?: string, ignoreEmpty = true) => {
    let joinArr = [...arr]
    if (ignoreEmpty) joinArr = joinArr.filter(i => i)
    return joinArr.join(separator)
}
/**
 * 简略字符串
 * @param s 要简略的字符串
 * @param briefLength 简略后的最大长度（包括连接符）
 * @param separator 连接字符
 */
export const briefString = (s: string, briefLength: number, separator = "...") => {
    briefLength = briefLength || s.length
    const nameLength = s.length
    if (nameLength <= briefLength) return s
    else {
        const index1 = Math.floor(briefLength / 2), index2 = index1 + (nameLength - briefLength)
        return s.slice(0, index1) + separator + s.slice(index2)
    }
}

/**
 * 因为设计理念的问题，js原生语法的toFixed和toLocaledString不能结合使用，
 * 这个函数就是用来实现一个同时实现fixed和localString转换的功能；
 * 与Number.toLocaleString不同的是小数部分进行了特殊的处理
 * @param n 数字
 * @param fractionDigits 同Number.prototype.toFixed的fractionDigits
 * @param locales 同Number.prototype.toLocaleString的locales
 * @param options 同Number.prototype.toLocaleString的options
 * @example
 */
export const numToLocaleFixed = (n: number, fractionDigits?: number, locales?: string | string[] | undefined, options?: Intl.NumberFormatOptions | undefined) => {
    if (typeof fractionDigits === "undefined") return n.toLocaleString(locales, options)
    if (n.toString().indexOf(".") < 0) return n.toLocaleString(locales, options)
    const [iPartStr, dPartStr] = n.toString().split(".")
    const dPart = parseFloat("0." + dPartStr).toFixed(fractionDigits)
    return [parseInt(iPartStr).toLocaleString(locales, options), dPart.slice(2)].join(".")
}

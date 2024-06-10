import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
// dayjs.locale('zh-cn')
dayjs.extend(duration)
dayjs.extend(relativeTime)

export default dayjs

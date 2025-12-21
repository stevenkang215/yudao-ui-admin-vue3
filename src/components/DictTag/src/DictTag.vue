<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue'
import { isHexColor } from '@/utils/color'
import { ElTag } from 'element-plus'
import { DictDataType, getDictOptions } from '@/utils/dict'
import { isArray, isBoolean, isNumber, isString } from '@/utils/is'

export default defineComponent({
  name: 'DictTag',
  props: {
    type: {
      type: String as PropType<string>,
      required: true
    },
    value: {
      type: [String, Number, Boolean, Array],
      required: true
    },
    // 字符串分隔符 只有当 props.value 传入值为字符串时有效
    separator: {
      type: String as PropType<string>,
      default: ','
    },
    // 每个 tag 之间的间隔，默认为 5px，参考的 el-row 的 gutter
    gutter: {
      type: String as PropType<string>,
      default: '5px'
    }
  },
  setup(props) {
    // 判断颜色是亮色还是暗色，返回合适的文字颜色
    const getTextColor = (bgColor: string): string => {
      if (!bgColor || !isHexColor(bgColor)) {
        return ''
      }
      // 移除 # 号
      const color = bgColor.replace('#', '')
      // 将颜色转换为 RGB
      const r = parseInt(color.substr(0, 2), 16)
      const g = parseInt(color.substr(2, 2), 16)
      const b = parseInt(color.substr(4, 2), 16)
      // 计算亮度 (使用 YIQ 公式)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      // 如果亮度大于 128，使用深色文字；否则使用浅色文字
      return brightness > 128 ? '#333' : '#fff'
    }
    const valueArr: any = computed(() => {
      // 1. 是 Number 类型和 Boolean 类型的情况
      if (isNumber(props.value) || isBoolean(props.value)) {
        return [String(props.value)]
      }
      // 2. 是字符串（进一步判断是否有包含分隔符号 -> props.sepSymbol ）
      else if (isString(props.value)) {
        return props.value.split(props.separator)
      }
      // 3. 数组
      else if (isArray(props.value)) {
        return props.value.map(String)
      }
      return []
    })
    const renderDictTag = () => {
      if (!props.type) {
        return null
      }
      // 解决自定义字典标签值为零时标签不渲染的问题
      if (props.value === undefined || props.value === null || props.value === '') {
        return null
      }
      const dictOptions = getDictOptions(props.type)

      return (
        <div
          class="dict-tag"
          style={{
            display: 'inline-flex',
            gap: props.gutter,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {dictOptions.map((dict: DictDataType) => {
            if (valueArr.value.includes(dict.value)) {
              if (dict.colorType + '' === 'primary' || dict.colorType + '' === 'default') {
                dict.colorType = ''
              }
              // 根据背景色自动选择合适的文字颜色
              const textColor =
                dict?.cssClass && isHexColor(dict?.cssClass) ? getTextColor(dict.cssClass) : ''
              return (
                <ElTag
                  style={textColor ? `color: ${textColor}` : ''}
                  type={dict?.colorType || null}
                  color={dict?.cssClass && isHexColor(dict?.cssClass) ? dict?.cssClass : ''}
                  disableTransitions={true}
                >
                  {dict?.label}
                </ElTag>
              )
            }
          })}
        </div>
      )
    }
    return () => renderDictTag()
  }
})
</script>

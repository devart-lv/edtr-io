import { styled } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'

import { createRowPluginTheme } from '.'

export const RowContainer = styled.div<{
  isFirst?: boolean
  editable: boolean
  name: string
  noHeight?: boolean
  expanded?: boolean
}>(
  ({
    isFirst,
    name,
    editable,
    noHeight,
    expanded,
    ...props
  }: {
    isFirst?: boolean
    name: string
    editable: boolean
    noHeight?: boolean
    expanded?: boolean
  } & ThemeProps) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      ...(!noHeight
        ? {
            minHeight: '10px',
            marginBottom: '25px',
            marginTop: isFirst ? '25px' : '0px'
          }
        : {}),
      marginLeft: editable ? '15px' : undefined,
      position: 'relative',
      borderLeft: '2px solid transparent',
      paddingLeft: '5px',
      transition: '250ms all ease-in-out',

      ...(expanded
        ? {
            borderColor: theme.color,
            paddingTop: 0,
            paddingBottom: 0
          }
        : {})
    }
  }
)
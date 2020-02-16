import {
  isTempFile,
  number,
  object,
  optional,
  string,
  upload,
  UploadHandler,
  UploadValidator,
  EditorPluginProps,
  EditorPlugin,
  boolean,
  ObjectStateType,
  UploadStateType,
  OptionalStateType,
  StringStateType,
  BooleanStateType,
  NumberStateType
} from '@edtr-io/plugin'

import { ImageEditor } from './editor'

/** @public */
export type ImageState = ObjectStateType<{
  src: UploadStateType<string>
  link: OptionalStateType<
    ObjectStateType<{
      href: StringStateType
      openInNewTab: BooleanStateType
    }>
  >
  alt: OptionalStateType<StringStateType>
  maxWidth: OptionalStateType<NumberStateType>
}>
/** @public */
export interface ImageConfig {
  upload: UploadHandler<string>
  validate: UploadValidator
  secondInput?: 'description' | 'link'
}
/** @public */
export type ImageProps = EditorPluginProps<ImageState, ImageConfig>

const imageState: ImageState = object({
  src: upload(''),
  link: optional(
    object({
      href: string(''),
      openInNewTab: boolean(false)
    })
  ),
  alt: optional(string('')),
  maxWidth: optional(number(0))
})

/**
 * @param config - {@link ImageConfig | Plugin configuration}
 * @public
 */
export function createImagePlugin(
  config: ImageConfig
): EditorPlugin<ImageState, ImageConfig> {
  return {
    Component: ImageEditor,
    config,
    state: imageState,
    onPaste: (clipboardData: DataTransfer) => {
      const value = clipboardData.getData('text')

      if (/\.(jpe?g|png|bmp|gif|svg)$/.test(value.toLowerCase())) {
        return {
          state: {
            src: value,
            link: undefined,
            alt: undefined,
            maxWidth: undefined
          }
        }
      }

      const files = getFilesFromDataTransfer(clipboardData)
      if (files.length === 1) {
        const file = files[0]
        const validation = config.validate(file)
        if (validation.valid) {
          return {
            state: {
              src: { pending: files[0] },
              link: undefined,
              alt: undefined,
              maxWidth: undefined
            }
          }
        }
      }
    },
    isEmpty: serializedState => {
      return (
        (!serializedState.src.value || isTempFile(serializedState.src.value)) &&
        (!serializedState.link.defined || !serializedState.link.href.value) &&
        (!serializedState.alt.defined || !serializedState.alt.value)
      )
    }
  }
}

function getFilesFromDataTransfer(clipboardData: DataTransfer) {
  const items = clipboardData.files
  const files: File[] = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!item) continue
    files.push(item)
  }
  return files
}

// @flow
import * as Saga from '../../util/saga'
import * as FsGen from '../fs-gen'
import {putActionIfOnPath, navigateAppend} from '../route-tree'
import {showImagePicker} from 'react-native-image-picker'
import {isIOS} from '../../constants/platform'

export const share = (action: FsGen.SharePayload) =>
  Saga.put(
    putActionIfOnPath(
      action.payload.routePath,
      navigateAppend([
        {
          props: {path: action.payload.path, isShare: true},
          selected: 'pathItemAction',
        },
      ])
    )
  )

export function* save(action: FsGen.SavePayload): Saga.SagaGenerator<any, any> {
  const {path, routePath} = action.payload
  Saga.put(FsGen.createDownload({path, intent: 'camera-roll'}))
  Saga.put(
    putActionIfOnPath(
      routePath,
      navigateAppend([
        {
          props: {path, isShare: true},
          selected: 'transferPopup',
        },
      ])
    )
  )
}

export const pickAndUpload = ({payload: {type}}: FsGen.PickAndUploadPayload) =>
  new Promise((resolve, reject) =>
    showImagePicker(
      {mediaType: 'photo'}, // TODO: support other types
      response =>
        !response.didCancel &&
        (response.error
          ? reject(response.error)
          : resolve(isIOS ? response.uri.replace('file://', '') : response.path))
    )
  )

export const pickAndUploadSuccess = (localPath: string, action: FsGen.PickAndUploadPayload) =>
  localPath && Saga.put(FsGen.createUpload({localPath, parentPath: action.payload.parentPath}))

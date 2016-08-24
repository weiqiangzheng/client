// Auto-generated by avdl-compiler v1.3.4 (https://github.com/keybase/node-avdl-compiler)
//   Input file: avdl/keybase1/notify_keyfamily.avdl

package keybase1

import (
	rpc "github.com/keybase/go-framed-msgpack-rpc"
	context "golang.org/x/net/context"
)

type KeyfamilyChangedArg struct {
	Uid UID `codec:"uid" json:"uid"`
}

type NotifyKeyfamilyInterface interface {
	KeyfamilyChanged(context.Context, UID) error
}

func NotifyKeyfamilyProtocol(i NotifyKeyfamilyInterface) rpc.Protocol {
	return rpc.Protocol{
		Name: "keybase.1.NotifyKeyfamily",
		Methods: map[string]rpc.ServeHandlerDescription{
			"keyfamilyChanged": {
				MakeArg: func() interface{} {
					ret := make([]KeyfamilyChangedArg, 1)
					return &ret
				},
				Handler: func(ctx context.Context, args interface{}) (ret interface{}, err error) {
					typedArgs, ok := args.(*[]KeyfamilyChangedArg)
					if !ok {
						err = rpc.NewTypeError((*[]KeyfamilyChangedArg)(nil), args)
						return
					}
					err = i.KeyfamilyChanged(ctx, (*typedArgs)[0].Uid)
					return
				},
				MethodType: rpc.MethodNotify,
			},
		},
	}
}

type NotifyKeyfamilyClient struct {
	Cli rpc.GenericClient
}

func (c NotifyKeyfamilyClient) KeyfamilyChanged(ctx context.Context, uid UID) (err error) {
	__arg := KeyfamilyChangedArg{Uid: uid}
	err = c.Cli.Notify(ctx, "keybase.1.NotifyKeyfamily.keyfamilyChanged", []interface{}{__arg})
	return
}

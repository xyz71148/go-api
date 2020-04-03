package types

import "github.com/xyz71148/go-api/api/models"

// swagger:response ContactRowsResponse
type RowsResponseContact struct {
	// in: body
	Body RowsResponseBodyContact
}
// swagger:response ContactRowResponse
type RowResponseContact struct {
	// in: body
	Body RowResponseBodyContact
}

type RowsResponseBodyDataContact struct {
	Rows		[]models.RobotContact
	PageSize 	int8
	PageNo 		int8
	Total 		int8
}

type RowResponseBodyDataContact struct {
	Row	models.RobotContact
}

type RowsResponseBodyContact struct {
	ErrNo   int
	Msg     string
	Data    []RowsResponseBodyDataContact
}
type RowResponseBodyContact struct {
	ErrNo   int
	Msg     string
	Data    RowResponseBodyDataContact
}

// swagger:parameters ContactRow ContactDelete ContactEdit
type RequestPathParam struct {
	//  Id
	//
	// in: path
	Id int
}

// swagger:parameters ContactRows
type RowsQueryParam struct {
	// 当前页
	//
	// in: query
	// default:1
	PageNo 		int
	// 当前页
	//
	// in: query
	// default:10
	PageSize 	int
	// 排序字段
	//
	// in: query
	//
	// default:id
	OrderField 	string
	// 排序类型
	//
	// DESC ASC
	//
	// in: query
	// default:DESC
	OrderType 	string
	// 过滤参数
	//
	//
	// in: query
	Filter 	string
}

// swagger:parameters ContactEdit ContactCreate
type SaveParam struct {
	// in: body
	Row 		SaveStructContact
}

type SaveStructContact struct{
	// 微信ID
	// required: true
	WxId 					string
	// 联系人微信ID
	// required: true
	FriendWxId 				string
	// 别名备注
	// required: true
	AliasName 				string
	// 状态 1 正常; 0 删除
	// required: true
	// default: true
	Status 					bool
}

package types

// swagger:parameters
type BaseRequestPathParam struct {
	// 机器人Id
	//
	// in: path
	Id int64
}

// swagger:parameters
type BaseRequestListQueryParam struct {
	// 当前页
	//
	// in: query
	// default:1
	PageNo int `form:"page"`
	// 当前页
	//
	// in: query
	// default:10
	PageSize int `form:"limit"`
	// 排序字段
	//
	// in: query
	//
	// default:id
	OrderField string `form:"sort"`
	// 排序类型
	//
	// DESC ASC
	//
	// in: query
	// default:DESC
	OrderType string `form:"order"`
}


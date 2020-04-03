package types

import (
	"github.com/kataras/iris"
)


// swagger:response GenericError
type GenericError struct {
	// in: body
	Body GenericErrorBody
}

type GenericErrorBody struct {
	// default 500
	ErrNo   int
	Msg     string
}

////////////////////////////////////////////////////////


// swagger:response BaseResponse
type BaseResponse struct {
	// in: body
	Body BaseResponseBody
}

type BaseResponseBody struct {
	ErrNo   int
	Msg     string
	Data    map[string]interface{}
}

////////////////////////////////////////////////////////

// swagger:response BaseEmptyResponse
type BaseEmptyResponse struct {
	// in: body
	Body BaseEmptyResponseBody
}


type BaseEmptyResponseBody struct {
	ErrNo   int
	Msg     string
}



func SendErrJSON(ctx iris.Context,Msg string) {
	ctx.Application().Logger().Errorf("error in %s,msg: %s",ctx.Path(),Msg)
	response := BaseResponseBody{
		ErrNo:ErrorCode.ERROR,
		Msg:Msg,
		Data: iris.Map{},
	}
	_, _ = ctx.JSON(response)
}

func SendJSON(ctx iris.Context,Data iris.Map) {
	response := BaseResponseBody{
		ErrNo:ErrorCode.SUCCESS,
		Msg:"success",
		Data: Data,
	}
	_, _ = ctx.JSON(response)
}

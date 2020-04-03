package models

import (
	"time"
)

// 	微信联系人
//	一个 微信ID 对应 多个 UserName
// 	swagger:model
type RobotContact struct {
	// required: true
	Id						int64 	`gorm:"primary_key" json:"id"`
	WxId					string	`gorm:"column:WxId"`
	UserName				string	`gorm:"column:UserName"`
	Remark					string	`gorm:"column:Remark"`
	RemarkPYInitial			string	`gorm:"column:RemarkPYInitial"`
	RemarkQuanPin			string	`gorm:"column:RemarkQuanPin"`
	DelFlag					int		`gorm:"column:DelFlag"`
	Type					int		`gorm:"column:Type"`
	UpdatedAt 				time.Time `gorm:"column:UpdatedAt"`
	CreatedAt 				time.Time `gorm:"column:CreatedAt"`
}

func (RobotContact) TableName() string {
	return "RobotContact"
}

type Contacts []struct {
	Id						int64 	`json:"id"`
	WxId					string	`gorm:"column:WxId"`
	WxName					string	`gorm:"column:WxName"`
	WxAvatar				string	`gorm:"column:WxAvatar"`
	UserName				string	`gorm:"column:UserName"`
	NickName				string	`gorm:"column:NickName"`
	Remark					string	`gorm:"column:Remark"`
	RemarkPYInitial			string	`gorm:"column:RemarkPYInitial"`
	RemarkQuanPin			string	`gorm:"column:RemarkQuanPin"`
	DelFlag					int		`gorm:"column:DelFlag"`
	Alias					string	`gorm:"column:Alias"`
	Type					int		`gorm:"column:Type"`
	SmallImg     				string  `gorm:"column:SmallImg"`
	UpdatedAt 				time.Time `gorm:"column:UpdatedAt"`
	CreatedAt 				time.Time `gorm:"column:CreatedAt"`
}

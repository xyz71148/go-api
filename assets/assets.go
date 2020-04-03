package assets

func GetRes(filename string) []byte {
	bt, err := Asset(filename)
	if err != nil {
		return []byte{}
	}
	return bt
}
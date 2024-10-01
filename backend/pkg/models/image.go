package models

import (
	"backend/pkg/structs"
)

// UploadImage uploads an image and returns its ID
func UploadImage(image []byte) (int, error) {
	columns := []string{"image_data"}
	values := []interface{}{image}
	id, err := CreateAndReturnID("ImageTable", columns, values)
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func DeleteImage(imageID int) error {
	return Delete("ImageTable", []string{"id"}, []interface{}{imageID})
}

func GetImageByID(imageID int) (*structs.Image, error) {
	rows, err := Read("ImageTable", []string{"*"}, []string{"id"}, []interface{}{imageID})
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, nil
	}

	var image structs.Image

	err = rows.Scan(
		&image.ID,
		&image.Data,
	)
	if err != nil {
		return nil, err
	}
	return &image, nil
}

func UpdateImage(imageID int, imageData []byte) error {
	columns := []string{"image_data"}
	values := []interface{}{imageData}
	return Update("ImageTable", columns, values, []string{"id"}, []interface{}{imageID})
}

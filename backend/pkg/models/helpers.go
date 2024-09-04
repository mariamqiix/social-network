package models

import (
	"backend/pkg/db"
	"database/sql"
	"fmt"
)

// Create inserts a new record into the specified table.
func Create(tableName string, columns []string, values []interface{}) error {
	colNames := ""
	placeholders := ""
	for i, col := range columns {
		if i > 0 {
			colNames += ", "
			placeholders += ", "
		}
		colNames += col
		placeholders += fmt.Sprintf("$%d", i+1)
	}

	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, colNames, placeholders)
	_, err := db.Database.Exec(query, values...)
	return err
}

// Update updates existing records in the specified table.
func Update(tableName string, columnsToSet []string, valuesToSet []interface{}, conditionColumn string, conditionValue interface{}) error {
	setClause := ""
	for i, col := range columnsToSet {
		if i > 0 {
			setClause += ", "
		}
		setClause += fmt.Sprintf("%s = $%d", col, i+1)
	}

	query := fmt.Sprintf("UPDATE %s SET %s WHERE %s = $%d", tableName, setClause, conditionColumn, len(valuesToSet)+1)
	_, err := db.Database.Exec(query, append(valuesToSet, conditionValue)...)
	return err
}

// Read retrieves records from the specified table based on a condition.
func Read(tableName string, columns []string, conditionColumn string, conditionValue interface{}) (*sql.Rows, error) {
	colNames := "*"
	if len(columns) > 0 {
		colNames = ""
		for i, col := range columns {
			if i > 0 {
				colNames += ", "
			}
			colNames += col
		}
	}

	query := fmt.Sprintf("SELECT %s FROM %s WHERE %s = $1", colNames, tableName, conditionColumn)
	rows, err := db.Database.Query(query, conditionValue)
	return rows, err
}

// Delete removes records from the specified table based on a condition.
func Delete(tableName string, conditionColumn string, conditionValue interface{}) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s = $1", tableName, conditionColumn)
	_, err := db.Database.Exec(query, conditionValue)
	return err
}

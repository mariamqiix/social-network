package models

import (
	"backend/pkg/db"
	"database/sql"
	"fmt"
	"strings"
	"sync"
)

var mutex = &sync.Mutex{}

// Create inserts a new record into the specified table.
func Create(tableName string, columns []string, values []interface{}) error {
	mutex.Lock()
	defer mutex.Unlock()

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

// Update updates existing records in the specified table with multiple conditions.
func Update(tableName string, columnsToSet []string, valuesToSet []interface{}, conditionColumns []string, conditionValues []interface{}) error {
	mutex.Lock()
	defer mutex.Unlock()

	if len(conditionColumns) != len(conditionValues) {
		return fmt.Errorf("number of condition columns does not match number of condition values")
	}

	// Construct the SET clause
	setClause := ""
	for i, col := range columnsToSet {
		if i > 0 {
			setClause += ", "
		}
		setClause += fmt.Sprintf("%s = $%d", col, i+1)
	}

	// Construct the WHERE clause
	whereClause := ""
	for i, col := range conditionColumns {
		if i > 0 {
			whereClause += " AND "
		}
		whereClause += fmt.Sprintf("%s = $%d", col, len(valuesToSet)+i+1)
	}

	// Prepare the SQL query
	query := fmt.Sprintf("UPDATE %s SET %s WHERE %s", tableName, setClause, whereClause)

	// Execute the query with the combined values (columnsToSet + conditionValues)
	_, err := db.Database.Exec(query, append(valuesToSet, conditionValues...)...)
	return err
}

// Read retrieves records from the specified table based on multiple conditions.
func Read(tableName string, columns []string, conditionColumns []string, conditionValues []interface{}) (*sql.Rows, error) {
	mutex.Lock()
	defer mutex.Unlock()

	// Ensure the number of condition columns matches the number of condition values
	if len(conditionColumns) != len(conditionValues) {
		return nil, fmt.Errorf("number of condition columns does not match number of condition values")
	}

	// Build the column names to retrieve
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

	// Build the WHERE clause for multiple conditions
	whereClause := ""
	if len(conditionColumns) > 0 {
		whereClause = " WHERE "
		for i, col := range conditionColumns {
			if i > 0 {
				whereClause += " AND "
			}
			whereClause += fmt.Sprintf("%s = $%d", col, i+1)
		}
	}

	// Prepare the SQL query
	query := fmt.Sprintf("SELECT %s FROM %s%s", colNames, tableName, whereClause)

	// Execute the query with the condition values
	rows, err := db.Database.Query(query, conditionValues...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	return rows, nil
}

func Delete(tableName string, conditionColumns []string, conditionValues []interface{}) error {
	mutex.Lock()
	defer mutex.Unlock()
	whereClause := ""
	if len(conditionColumns) > 0 {
		whereClause = " WHERE "
		for i, col := range conditionColumns {
			if i > 0 {
				whereClause += " AND "
			}
			whereClause += fmt.Sprintf("%s = $%d", col, i+1)
		}
	}
	query := fmt.Sprintf("DELETE FROM %s%s", tableName, whereClause)
	_, err := db.Database.Exec(query, conditionValues...)
	if err != nil {
		return fmt.Errorf("error executing delete query: %v", err)
	}
	return nil
}

// checks if values exist on a certain table for multiple columns
func CheckExistance(tablename string, columnnames []string, values []interface{}) (bool, error) {
	// Check if column names and values are aligned in length
	if len(columnnames) != len(values) {
		return false, fmt.Errorf("the number of column names and values do not match")
	}

	// Prepare the SQL query with placeholders for each column
	var conditions []string
	for _, col := range columnnames {
		conditions = append(conditions, fmt.Sprintf("%s = ?", col))
	}
	whereClause := strings.Join(conditions, " AND ")

	query := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE %s", tablename, whereClause)


	// Lock the mutex
	mutex.Lock()
	defer mutex.Unlock()

	// Prepare the statement
	stmt, err := db.Database.Prepare(query)
	if err != nil {
		return false, err
	}

	// Execute the query with the provided values and scan the result
	count := 0
	err = stmt.QueryRow(values...).Scan(&count)
	if err != nil {
		return false, err
	}

	fmt.Println(count)
	// Check if the count indicates existence
	return count > 0, nil
}

// CreateAndReturnID inserts a new record into the specified table and returns the last inserted ID
func CreateAndReturnID(table string, columns []string, values []interface{}) (int64, error) {
	// Construct the SQL query
	columnsStr := "(" + strings.Join(columns, ", ") + ")"
	placeholders := "(" + strings.Repeat("?, ", len(values)-1) + "?)"
	query := fmt.Sprintf("INSERT INTO %s %s VALUES %s", table, columnsStr, placeholders)

	// Execute the query
	result, err := db.Database.Exec(query, values...)
	if err != nil {
		return 0, err
	}

	// Get the last inserted ID
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

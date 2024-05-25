// // // To manage SQLite Database
// // import * as FileSystem from 'expo-file-system';
// // import {Asset} from 'expo-asset';
// // import { useState, useEffect } from 'react';

// // const loadDataBase =  async () => {
// //     const dbName = "main.db";
// //     const dbAsset = require("../assets/main.db");
// //     const dbUri = Asset.fromModule(dbASset).uri;
// //     const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

// //     const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
// //     if (!fileInfo.exists){
// //         await FileSystem.makeDirectoryAsync(
// //             `${FileSystem.documentDirectory}SQLite`,
// //             {intermediates: true}
// //         );
// //         await FileSystem.downloadAsync(dbUri, dbFilePath);
// //     }
// // }


// import {
//     enablePromise,
//     openDatabase,
//   } from "react-native-sqlite-storage"
  
//   // Enable promise for SQLite
//   enablePromise(true)
  
//   export const connectToDatabase = async () => {
//     return openDatabase(
//       { name: "yourProjectName.db", location: "default" },
//       () => {},
//       (error) => {
//         console.error(error)
//         throw Error("Could not connect to database")
//       }
//     )
//   }

//   export const createTables = async (db: SQLiteDatabase) => {
//     const userPreferencesQuery = `
//       CREATE TABLE IF NOT EXISTS UserPreferences (
//           id INTEGER DEFAULT 1,
//           colorPreference TEXT,
//           languagePreference TEXT,
//           PRIMARY KEY(id)
//       )
//     `
//     const contactsQuery = `
//      CREATE TABLE IF NOT EXISTS Contacts (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         firstName TEXT,
//         name TEXT,
//         phoneNumber TEXT
//      )
//     `
//     try {
//       await db.executeSql(userPreferencesQuery)
//       await db.executeSql(contactsQuery)
//     } catch (error) {
//       console.error(error)
//       throw Error(`Failed to create tables`)
//     }
//   }

//   export const getTableNames = async (db: SQLiteDatabase): Promise<string[]> => {
//     try {
//       const tableNames: string[] = []
//       const results = await db.executeSql(
//         "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
//       )
//       results?.forEach((result) => {
//         for (let index = 0; index < result.rows.length; index++) {
//           tableNames.push(result.rows.item(index).name)
//         }
//       })
//       return tableNames
//     } catch (error) {
//       console.error(error)
//       throw Error("Failed to get table names from database")
//     }
//   }
  
//   export const removeTable = async (db: SQLiteDatabase, tableName: Table) => {
//     const query = `DROP TABLE IF EXISTS ${tableName}`
//     try {
//       await db.executeSql(query)
//     } catch (error) {
//       console.error(error)
//       throw Error(`Failed to drop table ${tableName}`)
//     }
//   }























// // import * as SQLite from 'expo-sqlite';

// // const db = await SQLite.openDatabaseAsync('myDatabase.db');

// // export function createTables() {
// //     db.exec([{ sql: 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);', args: [] }], false, () => {
// //       console.log('Table created successfully');
// //     });
// //   }

// // // // `execAsync()` is useful for bulk queries when you want to execute altogether.
// // // // Please note that `execAsync()` does not escape parameters and may lead to SQL injection.
// // // await db.execAsync(`
// // // PRAGMA journal_mode = WAL;
// // // CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
// // // INSERT INTO test (value, intValue) VALUES ('test1', 123);
// // // INSERT INTO test (value, intValue) VALUES ('test2', 456);
// // // INSERT INTO test (value, intValue) VALUES ('test3', 789);
// // // `);

// // // // `runAsync()` is useful when you want to execute some write operations.
// // // const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'aaa', 100);
// // // console.log(result.lastInsertRowId, result.changes);
// // // await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', 999, 'aaa'); // Binding unnamed parameters from variadic arguments
// // // await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']); // Binding unnamed parameters from array
// // // await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' }); // Binding named parameters from object

// // // // `getFirstAsync()` is useful when you want to get a single row from the database.
// // // const firstRow = await db.getFirstAsync('SELECT * FROM test');
// // // console.log(firstRow.id, firstRow.value, firstRow.intValue);

// // // // `getAllAsync()` is useful when you want to get all results as an array of objects.
// // // const allRows = await db.getAllAsync('SELECT * FROM test');
// // // for (const row of allRows) {
// // //   console.log(row.id, row.value, row.intValue);
// // // }

// // // // `getEachAsync()` is useful when you want to iterate SQLite query cursor.
// // // for await (const row of db.getEachAsync('SELECT * FROM test')) {
// // //   console.log(row.id, row.value, row.intValue);
// // // }
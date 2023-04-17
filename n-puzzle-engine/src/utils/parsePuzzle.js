const FILE_NOT_EXIST = "FILE_NOT_EXIST";
const DIFFERS_ROWS_AND_COLUMNS = "DIFFERS_ROWS_AND_COLUMNS";
const EMPTY_FILE = "EMPTY_FILE";
const EMPTY_ROW = "EMPTY_ROW";
const INVALID_ROW = "INVALID_ROW";
const INVALID_DIMENSION = "INVALID_DIMENSION";
const WRONG_NUMBER_ROWS = "WRONG_NUMBER_ROWS";
const WRONG_NUMBER_COLS = "WRONG_NUMBER_COLS";
const LOW_DIMENSION = "LOW_DIMENSION";
const NO_LAST_EMPTY_LINE = "NO_LAST_EMPTY_LINE";
const TOO_LARGE_NUMBER = "TOO_LARGE_NUMBER";
const HAS_DUPLICATES = "HAS_DUPLICATES";

/**
 * 
 * @param {ENUM} key 
 * @param {string} message 
 * @returns {string} formed message
 */
const errorMessages = (key, message) => {
    switch (key) {
        case FILE_NOT_EXIST:
            return `File ${(message)} not exist`;
        case DIFFERS_ROWS_AND_COLUMNS:
            return "Number of rows differs from number of columns";
        case EMPTY_FILE:
            return "Empty file is not allowed";
        case EMPTY_ROW:
            return "Empty row is not allowed. Please remove all empty rows in a file";
        case INVALID_ROW:
            return `Invalid row ${(message)}. Please use only digits or comment in the end of the row`;
        case INVALID_DIMENSION:
            return `Please use only one number for dimension, ${(message)} invalid`;
        case WRONG_NUMBER_ROWS:
            return "Dimension not equal number of rows";
        case WRONG_NUMBER_COLS:
            return "Dimension not equal number of cols";
        case LOW_DIMENSION:
            return "Dimension is too low, should be greater than 3";
        case NO_LAST_EMPTY_LINE:
            return "Please add empty line to the end of the file";
        case TOO_LARGE_NUMBER:
            return `${(message)} is too large number for this type of field`;
        case HAS_DUPLICATES:
            return `Field has duplicate number ${(message)}, please use unique numbers`;
    }
};

const error = (key, message = "") => {
    const errorMessage = errorMessages(key, message);
    console.log(errorMessage)
    return errorMessage
};

const validateFile = (fileTxt) => {
    try {


        const fileStr = fileTxt
        if (fileStr.length === 0) {
            return error(EMPTY_FILE);

        }
        const splitedStr = fileStr.split("\n");
        splitedStr.forEach((row, index) => {
            if (row.length === 0 && index !== splitedStr.length - 1) {
                return error(EMPTY_ROW);

            }
            if (index === splitedStr.length - 1 && row.length > 0) {
                return error(NO_LAST_EMPTY_LINE);

            }
        });
        let dimension = undefined;

        let fileInfo = fileStr.replace(/#.+($|\n)/g, "$1")
            .split("\n")
            .filter((row) => row.length > 0)
            .map((row, index) => {
                if (index === 0) {
                    dimension = Number(row);
                    if (!dimension) {
                        throw error(INVALID_DIMENSION, row);

                    }
                    if (dimension < 3) {
                        throw error(LOW_DIMENSION);

                    }
                }
                if (index === 0 && !/[0-9]*/.test(row)) {
                    throw error(INVALID_ROW, row);

                }
                return row.split(/\s+/g).filter((x) => x.length).map((cell) => {
                    if (index > 0 && /[^0-9]/.test(cell)) {
                        throw error(INVALID_ROW, row);

                    }
                    const number = Number(cell);
                    if (number > (dimension * dimension - 1)) {
                        throw error(TOO_LARGE_NUMBER, number);
                    }
                    return number;
                });
            });


        if (fileInfo.length - 1 !== dimension) {
            return error(WRONG_NUMBER_ROWS);
        }
        let array = [];
        for (let i = 1; i < fileInfo.length; i++) {
            if (fileInfo[i].length !== dimension) {
                return error(WRONG_NUMBER_COLS);
            }
            array = [...array, ...fileInfo[i]];
        }
        const duplicate = hasDuplicates(array);
        if (duplicate !== undefined) {
            return error(HAS_DUPLICATES, duplicate);
        }
        fileInfo.shift()
        return { valid: true, puzzle: fileInfo }
    } catch (error) {
        return { valid: false, error }
    }
};

const hasDuplicates = (array) => array.find((element, index) => (array.indexOf(element) !== index));

export default validateFile
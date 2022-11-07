import { lastValueFrom, timer } from "rxjs";
import { Result } from "true-myth";
import { v4 } from "uuid";
import { SavedUserAccount, User } from "../models/user.model";

export type loading = 'LOADING';

export enum UserValidationError {
    USERNAME_EMPTY = 'Username cannot be empty!',
    USERNAME_INVALID_CHARS = 'Username must only contain alphanumeric chars and dashes/underscores'
}

export const VALID_USERNAME_REGEX = /^[A-Za-z0-9_-]+$/;

export enum UserSaveError {
    DB_SAVE_FAILED = "Failed saving user to the database!"
}

export type UserError = UserValidationError | UserSaveError;

export async function saveUser(input: User | loading): Promise<Result<SavedUserAccount | loading, UserSaveError>> {
    if(input === 'LOADING')
        return Result.ok('LOADING');
    
    // Let's pretend we made a call to our user database to save the user and
    //  this is the new user's user ID
    await lastValueFrom(timer(50));

    if (Math.random() * 2 > 1 ? true : false)
        return Promise.resolve(Result.err(UserSaveError.DB_SAVE_FAILED))

    const savedUser = new SavedUserAccount(v4(), input.username, input.firstName, input.lastName);
    return Promise.resolve(Result.ok(savedUser));
}

export async function validateUsernameNotEmpty(input: User | loading): Promise<Result<User | loading, UserValidationError>> {
    await lastValueFrom(timer(50));
    if(input === 'LOADING')
        return Result.ok('LOADING');

    if (input.username.length === 0)
        return Result.err(UserValidationError.USERNAME_EMPTY);

    return Result.ok(input);
}

export function validateUsernameHasValidChars(input: User | loading): Result<User | loading, UserValidationError | UserError> {
    if(input === 'LOADING')
        return Result.ok('LOADING')
    
    if (!input.username.match(VALID_USERNAME_REGEX))
        return Result.err(UserValidationError.USERNAME_INVALID_CHARS);
    return Result.ok(input);
}

export function printSavedUser(input: SavedUserAccount) {
    console.log('User is valid: ', input);
}

export function printError(error: UserError) {
    console.log('User is invalid: ', error);
}
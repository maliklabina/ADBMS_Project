import * as assert from 'assert';
import * as vscode from 'vscode';
import { activate } from '../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample Test', () => {
        const expected = 1;
        const actual = 1;
        assert.strictEqual(actual, expected, 'The actual value does not match the expected value.');
    });

    test('Activate Extension', async () => {
        const extension = activate();
        assert.ok(extension, 'The extension did not activate successfully.');
    });
});
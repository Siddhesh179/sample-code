'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //let configurations = vscode.workspace.getConfiguration('javaDebug');
    var outputChannel = vscode.window.createOutputChannel('Java Debug');
    outputChannel.appendLine('"java-debug" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json    
    var compile = vscode.commands.registerCommand('javaDebug.compile', function () {
        outputChannel.clear();
        outputChannel.show();
        var editor = vscode.window.activeTextEditor;
        var fullFileName = editor.document.fileName;
        if (!editor || !fullFileName) {
            return;
        }
        if (!fullFileName.endsWith('.java')) {
            return;
        }
        if (editor.document.isDirty) {
            outputChannel.appendLine('File saved.');
            editor.document.save();
        }
        var exec = require('child_process').exec;
        var cmd = 'javac -encoding utf8 "' + fullFileName + '"';
        outputChannel.appendLine('Execute command: ' + cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (stderr) {
                outputChannel.appendLine(stderr);
                return;
            }
            outputChannel.appendLine('Successed!');
        });
    });
    var run = vscode.commands.registerCommand('javaDebug.run', function () {
        outputChannel.clear();
        var editor = vscode.window.activeTextEditor;
        var fullFileName = editor.document.fileName;
        if (!editor || !fullFileName) {
            return;
        }
        if (!fullFileName.endsWith('.java')) {
            return;
        }
        var isUnixLike = fullFileName.startsWith('/');
        var fileNameIndex = isUnixLike ? fullFileName.lastIndexOf('/') : fullFileName.lastIndexOf('\\');
        var fileName = fullFileName.substring(fileNameIndex + 1);
        var folderPath = fullFileName.substring(0, fileNameIndex);
        var className = fileName.substring(0, fileName.indexOf('.java'));
        var exec = require('child_process').exec;
        var cmd = 'java -cp "' + folderPath + '" "' + className + '"';
        vscode.window.setStatusBarMessage('Execute command: ' + cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (stderr) {
                outputChannel.appendLine(stderr);
            }
            else if (stdout) {
                outputChannel.appendLine(stdout);
            }
        });
    });
    context.subscriptions.push(compile);
    context.subscriptions.push(run);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=javaDebug.js.map
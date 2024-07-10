import chalk from "chalk";
import { execa } from "execa";
import fs from "fs";
import Listr from "listr";
import path from "path";
import { promisify } from "util";
import { copyTemplateFiles, editTemplateFile } from "./fileManagement.js";

const access = promisify(fs.access)

async function initWorkspace(options) {
    const result = await execa('npx', ['create-nx-workspace@latest', options.name], {
        stdio: ['inherit', 'inherit', 'inherit', 'pipe']
    })

    if (result.failed) {
        return Promise.reject(new Error('Failed to create workspace'))
    }

    return;
}

async function initApp(options) {
    const result = await execa('npx', ['nx', 'g', '@nx/angular:app', options.name], {
        cwd: options.targetDirectory,
        stdio: ['inherit', 'inherit', 'inherit', 'pipe']
    })

    if (result.failed) {
        return Promise.reject(new Error('Failed to create app'))
    }

    return;
}

export async function createAngularProject(options) {
    options = {
        ...options,
        targetDirectory: process.cwd() + "/" + options.name,
        targetDirectoryApp: process.cwd() + "/" + options.name + "/apps/" + options.name
    }

    const currentFileUrl = import.meta.url;
    const currentFilePath = new URL(currentFileUrl).pathname;
    const normalizedPath = path.normalize(currentFilePath).substring(1)

    const templateDir = path.resolve(
        normalizedPath,
        '../../templates/override'
    );
    options.templateDirectory = templateDir

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.log(chalk.red.bold("ERROR"), err)
        process.exit(1)
    }

    const tasks = new Listr([
        {
            title: "Inicializando workspace",
            task: () => initWorkspace(options),
            enabled: () => options.type == 'workspace'
        },
        {
            title: "Inicializando app",
            task: () => initApp(options),
            enabled: () => options.type == 'app'
        },
        {
            title: "Copiando Configurações do fluig",
            task: () => copyTemplateFiles(options)
        },
        {
            title: "Editando arquivos para compatibilidade com o fluig",
            task: () => editTemplateFile(options)
        }
    ])

    try {
        await tasks.run();
        console.log(chalk.green.bold("DONE"), "Project ready")
    } catch (e) {
        console.log(chalk.red.bold("ERROR"), e)
    }
    return true
}
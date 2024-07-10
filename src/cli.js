import arg from 'arg';
import inquirer from 'inquirer';
import { createAngularProject } from './index.js';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--yes': Boolean,
            '-Y': '--yes'
        },
        {
            argv: rawArgs.slice(2)
        });
    return {
        fullInstall: args['--yes'] || false,
    }
}

async function promptForMissingOptions(options) {
    const questions = [];
    const defaultProjectName = 'new-project'
    const defaultWidgetName = 'new-widget'
    const defaultType = 'full'

    if (options.fullInstall) {
        return {
            ...options,
            name: options.name || defaultProjectName,
            name: options.widgetName || defaultProjectName,
            type: options.type || defaultType
        }
    } else {
        questions.push({
            type: 'input',
            name: 'name',
            message: 'Por favor, selecione um nome para o projeto:',
            default: defaultProjectName
        },
            {
                type: 'input',
                name: 'widgetName',
                message: 'Por favor, selecione o nome da widget:',
                default: defaultWidgetName
            }, {
            type: 'list',
            name: 'type',
            message: 'Por favor, selecione o tipo de criação do projeto:',
            choices: ['workspace', 'app', 'nenhum'],
            default: defaultType
        })
    }

    const answers = await inquirer.prompt(questions)

    return {
        ...options,
        name: options.name || answers.name,
        widgetName: options.widgetName || answers.widgetName,
        type: options.type || answers.type
    }
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createAngularProject(options);
}
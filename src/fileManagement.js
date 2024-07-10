import fs from "fs/promises";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";

const copy = promisify(ncp)

export async function editTemplateFile(options) {
    const filePath = path.join(options.targetDirectoryApp, 'project.json');

    try {
        const data = await fs.readFile(filePath, 'utf8');
        let json = JSON.parse(data);
        json.targets = getFixedJson(json.targets, options)

        const updatedData = JSON.stringify(json, null, 2);
        await fs.writeFile(filePath, updatedData, 'utf8');
    } catch (err) {
        return Promise.reject(new Error("Error editing file:" + err))
    }
}

export async function copyTemplateFiles(options) {
    return await copy(options.templateDirectory, options.targetDirectoryApp, {
        clobber: true
    })
}

function getFixedJson(targets, options) {
    targets = getFixedOutputPath(targets, options.widgetName)
    targets = getFixedBudgets(targets, "production")
    targets = removeHashBuild(targets, "production")
    targets = removeHashBuild(targets, "development")
    targets = setDebugMode(targets)
    targets = fixServeDefaultMode(targets, options.name)

    return targets
}

function getFixedOutputPath(targets, widget) {
    targets.build.options.outputPath = "../../wcm/widget/" + widget + "/src/main/webapp/resources/js/app-angular"

    return targets
}

function getFixedBudgets(targets, env) {
    const defaultBudgets = [
        {
            "type": "initial",
            "maximumWarning": "800kb",
            "maximumError": "5mb"
        },
        {
            "type": "anyComponentStyle",
            "maximumWarning": "10kb",
            "maximumError": "15kb"
        }
    ]

    targets.build.configurations[env].budgets = defaultBudgets

    return targets
}

function removeHashBuild(targets, env) {
    targets.build.configurations[env].outputHashing = "none"

    return targets
}

function setDebugMode(targets) {
    targets.build.configurations.debug = {
        "fileReplacements": [
            {
                "replace": "src/environments/environment.ts",
                "with": "src/environments/environment.development.ts"
            }
        ],
        "budgets": [
            {
                "type": "initial",
                "maximumWarning": "800kb",
                "maximumError": "3mb"
            },
            {
                "type": "anyComponentStyle",
                "maximumWarning": "15kb",
                "maximumError": "20kb"
            }
        ],
        "optimization": false,
        "extractLicenses": false,
        "sourceMap": true,
        "namedChunks": true
    }

    return targets
}

function fixServeDefaultMode(targets, appName) {
    targets.serve.configurations.debug = {
        "buildTarget": appName + ":build:debug"
    }
    targets.serve.defaultConfiguration = "debug"

    return targets
}
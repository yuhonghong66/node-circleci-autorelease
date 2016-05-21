// @flow
import fs from 'fs'
import path from 'path'

export default class WorkingDirectory {

    path: string;

    constructor() {
        this.path = process.cwd()
    }


    resolve() {
        if (this.inNodeModules() && this.upperPackageJSON()) {
            this.path = path.normalize(this.path + '/../..')
        }

        return this.path
    }


    inNodeModules() {

        return path.basename(path.normalize(this.path + '/..')) === 'node_modules'
    }


    upperPackageJSON() {

        let upperPackagePath = path.normalize(this.path + '/../../package.json')

        return fs.existsSync(upperPackagePath)
    }
}

// @flow

import fs from 'fs'
import yaml from 'js-yaml'
import {join} from 'path'


export default class AutoreleaseYml {

    __data: Object

    static filename = '.autorelease.yml'

    static defaultConfig = {
        git_user_name: 'CircleCI',
        git_user_email: 'circleci@cureapp.jp',
        version_prefix: 'v',
        create_branch: 1,
        gh_pages_dir: 'doc',
        npm_shrinkwrap: 1,
        npm_update_depth: 9999
    }


    /**
     * load yml file in the given directory
     * @public
     */
    static loadFromDir(dirPath: string): AutoreleaseYml {
        const path = join(dirPath, this.filename)
        return new AutoreleaseYml(path)
    }


    constructor(path: string) {
        this.__data = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    }


    config(key: string): string|number|boolean {
        let val = this.__data.config ? this.__data.config[key] : undefined
        return (val != null)? val : this.constructor.defaultConfig[key]
    }

    get circle(): Object {
        return Object.assign({}, this.__data.circle)
    }

    /**
     * check format of autorelease.yml
     * @public
     */
    checkFormat() {

        if (!this.__data) throw new Error('Yaml has not been loaded.')

        Object.keys(this.__data).forEach(name => {
            if (! this.rootFieldNames.includes(name)) {
                throw new Error(`Unknown field: "${name}"`)
            }
        })

        const { hooks, config, circle } = this.__data

        if (hooks) this.checkHooksFormat(hooks)
        if (config) this.checkConfigFormat(config)
        if (circle) this.checkCircleFormat(circle)
    }


    /**
     * @private
     */
    get rootFieldNames(): Array<string> {
        return ['hooks', 'config', 'circle']
    }



    /**
     * @private
     */
    get hookNames(): Array<string> {
        return ['update_modules', 'release', 'gh_pages']
    }

    /**
     * @private
     */
    get configNames(): Array<string> {
        return [
            'git_user_name',
            'git_user_email',
            'version_prefix',
            'create_branch',
            'create_gh_pages',
            'gh_pages_dir',
            'npm_shrinkwrap',
            'npm_update_depth'
        ]
    }



    /**
     * @private
     */
    checkHooksFormat(hooks: Object) {

        Object.keys(hooks).forEach(name => {
            if (! this.hookNames.includes(name)) {
                throw new Error(`Unknown field: "hooks.${name}"`)
            }

            if (!hooks[name].pre && !hooks[name].post) {
                throw new Error(`Field not found: "hooks.${name}.pre" or "hooks.${name}.post" is required.`)
            }

            Object.keys(hooks[name]).forEach(subname => {
                if (! ['pre', 'post'].includes(subname)) {
                    throw new Error(`Unknown field: "hooks.${name}.${subname}"`)
                }
                this.checkHookCommandFormat(hooks[name][subname], name, subname)
            })
        })
    }


    /**
     * @private
     */
    checkHookCommandFormat(cmds: any, name: string, subname: string) {
        if (typeof cmds === 'string') {
            return
        }

        if (Array.isArray(cmds)) {
            if (typeof cmds === 'string') {
                return
            }
            return
        }

        throw new Error(`Invalid type: "hooks.${name}.${subname}". It should be an array or a string.`)
    }


    /**
     * @private
     */
    checkConfigFormat(config: Object) {
        Object.keys(config).forEach(name => {
            if (!this.configNames.includes(name)) {
                throw new Error(`Unknown field: "config.${name}"`)
            }

            if (typeof config[name] === 'object') {
                throw new Error(`Invalid type: "config.${name}". "It should not be an object."`)
            }

        })
    }

    /**
     * @private
     */
    checkCircleFormat(circle: Object) {
        return
    }


}

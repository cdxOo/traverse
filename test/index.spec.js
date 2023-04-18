'use strict';
var { expect } = require('chai');
var traverse = require('../src/');

describe('options.createPathToken', () => {
    it('just key by default', () => {
        var paths = [];
        traverse({ foo: ['a', { quux: 42 }] }, (node) => {
            var { path } = node;
            paths.push(path.join('.'))
        }, { traverseArrays: true });

        expect(paths).to.eql([
            '',
            'foo',
            'foo.0', 
            'foo.1',
            'foo.1.quux',
        ])
    })

    it('custom tokenization for array indices', () => {
        var paths = [];
        traverse({ foo: ['a', { quux: 42 }] }, (node) => {
            var { path } = node;
            paths.push(path.join('.'))
        }, {
            traverseArrays: true,
            createPathToken: (bag) => {
                var { parentNode, key, value } = bag;
                if (Array.isArray(parentNode.value)) {
                    return `[${key}]`
                }
                else {
                    return String(key);
                }
            }
        });
        expect(paths).to.eql([
            '',
            'foo',
            'foo.[0]',
            'foo.[1]',
            'foo.[1].quux',
        ]);
    })
})

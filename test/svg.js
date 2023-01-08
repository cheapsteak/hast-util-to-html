import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {h, s} from 'hastscript'
import {toHtml} from '../index.js'

test('svg', () => {
  assert.deepEqual(
    toHtml(s('path'), {space: 'svg'}),
    '<path></path>',
    'should serialize `element`s'
  )

  assert.deepEqual(
    toHtml(s('foo'), {space: 'svg'}),
    '<foo></foo>',
    'should serialize unknown `element`s'
  )

  assert.deepEqual(
    toHtml(s('g', s('circle')), {space: 'svg'}),
    '<g><circle></circle></g>',
    'should serialize `element`s with content'
  )

  assert.deepEqual(
    toHtml(s('circle'), {space: 'svg', closeEmptyElements: true}),
    '<circle />',
    'should serialize with ` /` in `closeEmptyElements` mode'
  )

  assert.deepEqual(
    toHtml(s('circle'), {
      space: 'svg',
      closeEmptyElements: true,
      tightSelfClosing: true
    }),
    '<circle/>',
    'should serialize empties with `/` in `closeEmptyElements` and `tightSelfClosing` mode'
  )

  // `<circle cx=2 cy=2 r=1/>` does not work in browsers.  Needs a space.
  assert.deepEqual(
    toHtml(s('svg', {viewBox: '0 0 4 4'}, s('circle', {cx: 2, cy: 2, r: 1})), {
      preferUnquoted: true,
      closeEmptyElements: true,
      tightSelfClosing: true
    }),
    '<svg viewBox="0 0 4 4"><circle cx=2 cy=2 r=1 /></svg>',
    'should serialize empties with `/` in `closeEmptyElements` and `tightSelfClosing` mode, *with* a space after an unquoted attribute'
  )

  assert.deepEqual(
    toHtml(s('text', {dataFoo: 'alpha'}, 'bravo')),
    '<text data-foo="alpha">bravo</text>',
    'should serialize properties'
  )

  assert.deepEqual(
    toHtml(s('text', {className: ['alpha']}, 'bravo'), {space: 'svg'}),
    '<text class="alpha">bravo</text>',
    'should serialize special properties'
  )

  assert.deepEqual(
    toHtml(s('circle', {title: ''}), {
      space: 'svg',
      collapseEmptyAttributes: true
    }),
    '<circle title></circle>',
    'should collapse empty string attributes in `collapseEmptyAttributes` mode'
  )

  assert.deepEqual(
    toHtml(s('text', {className: ['a', 'b'], title: 'c d'}, 'bravo'), {
      space: 'svg'
    }),
    '<text class="a b" title="c d">bravo</text>',
    'should serialize multiple properties'
  )

  assert.deepEqual(
    toHtml(s('text', {className: ['a', 'b'], title: 'c d'}, 'bravo'), {
      space: 'svg',
      tightAttributes: true
    }),
    '<text class="a b"title="c d">bravo</text>',
    'should serialize multiple properties tightly in `tightAttributes` mode'
  )

  assert.deepEqual(
    toHtml(s('text', {className: ['alpha', 'charlie']}, 'bravo'), {
      space: 'svg'
    }),
    '<text class="alpha charlie">bravo</text>',
    'should serialize space-separated attributes'
  )

  assert.deepEqual(
    toHtml(s('glyph', {glyphName: ['foo', 'bar']}), {space: 'svg'}),
    '<glyph glyph-name="foo, bar"></glyph>',
    'should serialize comma-separated attributes'
  )

  assert.deepEqual(
    toHtml(s('glyph', {glyphName: ['foo', 'bar']}), {
      tightCommaSeparatedLists: true,
      space: 'svg'
    }),
    '<glyph glyph-name="foo,bar"></glyph>',
    'should serialize comma-separated attributes tighly in `tightCommaSeparatedLists` mode'
  )

  assert.deepEqual(
    toHtml(s('circle', {unknown: ['alpha', 'bravo']}), {space: 'svg'}),
    '<circle unknown="alpha bravo"></circle>',
    'should serialize unknown lists as space-separated'
  )

  assert.deepEqual(
    toHtml(s('a', {download: true}, 'bravo'), {space: 'svg'}),
    '<a download>bravo</a>',
    'should serialize known boolean attributes set to `true`'
  )

  assert.deepEqual(
    toHtml(s('a', {download: false}, 'bravo'), {space: 'svg'}),
    '<a>bravo</a>',
    'should ignore known boolean attributes set to `false`'
  )

  assert.deepEqual(
    toHtml(s('a', {download: 1}, 'bravo'), {space: 'svg'}),
    '<a download>bravo</a>',
    'should serialize truthy known boolean attributes'
  )

  assert.deepEqual(
    toHtml(s('a', {download: 0}, 'bravo'), {space: 'svg'}),
    '<a>bravo</a>',
    'should ignore falsey known boolean attributes'
  )

  assert.deepEqual(
    toHtml(s('a', {unknown: false}, 'bravo'), {space: 'svg'}),
    '<a>bravo</a>',
    'should ignore unknown attributes set to `false`'
  )

  assert.deepEqual(
    toHtml(s('a', {unknown: true}, 'bravo'), {space: 'svg'}),
    '<a unknown>bravo</a>',
    'should serialize unknown attributes set to `true`'
  )

  assert.deepEqual(
    toHtml(s('path', {strokeOpacity: 0.7}), {space: 'svg'}),
    '<path stroke-opacity="0.7"></path>',
    'should serialize positive known numeric attributes'
  )

  assert.deepEqual(
    toHtml(s('path', {strokeMiterLimit: -1}), {space: 'svg'}),
    '<path stroke-miterlimit="-1"></path>',
    'should serialize negative known numeric attributes'
  )

  assert.deepEqual(
    toHtml(s('path', {strokeOpacity: 0}), {space: 'svg'}),
    '<path stroke-opacity="0"></path>',
    'should serialize known numeric attributes set to `0`'
  )

  assert.deepEqual(
    toHtml(s('path', {strokeOpacity: Number.NaN}), {space: 'svg'}),
    '<path></path>',
    'should ignore known numeric attributes set to `NaN`'
  )

  assert.deepEqual(
    // @ts-expect-error runtime.
    toHtml(s('path', {strokeOpacity: {toString}}), {space: 'svg'}),
    '<path stroke-opacity="yup"></path>',
    'should serialize known numeric attributes set to non-numeric values'
  )

  assert.deepEqual(
    toHtml(s('svg', {viewBox: '0 0 10 10'}), {space: 'svg'}),
    '<svg viewBox="0 0 10 10"></svg>',
    'should serialize other attributes'
  )

  assert.deepEqual(
    toHtml(s('svg', {viewBox: ''}), {space: 'svg'}),
    '<svg viewBox=""></svg>',
    'should serialize other falsey attributes'
  )

  assert.deepEqual(
    toHtml(s('i', {id: true}, 'bravo'), {space: 'svg'}),
    '<i id>bravo</i>',
    'should serialize other non-string attributes'
  )

  assert.deepEqual(
    toHtml(s('svg', {viewBox: '0 0 10 10'}), {space: 'svg', quote: "'"}),
    "<svg viewBox='0 0 10 10'></svg>",
    'should quote attribute values with single quotes if `quote: "\'"`'
  )

  assert.deepEqual(
    toHtml(s('svg', {viewBox: '0 0 10 10'}), {space: 'svg', quote: '"'}),
    '<svg viewBox="0 0 10 10"></svg>',
    "should quote attribute values with double quotes if `quote: '\"'`"
  )

  assert.deepEqual(
    toHtml(s('circle', {title: '"some \' stuff"'}), {
      space: 'svg',
      quote: '"',
      quoteSmart: true
    }),
    "<circle title='&#x22;some &#x27; stuff&#x22;'></circle>",
    'should quote smartly if the other quote is less prominent (#1)'
  )

  assert.deepEqual(
    toHtml(s('circle', {title: "'some \" stuff'"}), {
      space: 'svg',
      quote: '"',
      quoteSmart: true
    }),
    '<circle title="&#x27;some &#x22; stuff&#x27;"></circle>',
    'should quote smartly if the other quote is less prominent (#2)'
  )

  assert.deepEqual(
    toHtml(s('circle', {cx: 2}), {space: 'svg', preferUnquoted: true}),
    '<circle cx=2></circle>',
    'should omit quotes in `preferUnquoted`'
  )

  assert.deepEqual(
    toHtml(s('circle', {'3<5\0': 'alpha'}), {space: 'svg'}),
    '<circle 3&#x3C;5&#x0;="alpha"></circle>',
    'should encode entities in attribute names'
  )

  assert.deepEqual(
    toHtml(s('circle', {title: '3<5\0'}), {space: 'svg'}),
    '<circle title="3<5&#x0;"></circle>',
    'should encode entities in attribute values'
  )

  assert.deepEqual(
    toHtml(s('circle', {'3=5\0': 'alpha'}), {
      space: 'svg',
      allowParseErrors: true
    }),
    '<circle 3&#x3D;5&#x0;="alpha"></circle>',
    '*should* encode characters in attribute names which cause parse errors, work, even though `allowParseErrors` mode is on'
  )

  assert.deepEqual(
    toHtml(s('circle', {title: '3"5\0'}), {
      space: 'svg',
      allowParseErrors: true
    }),
    '<circle title="3&#x22;5&#x0;"></circle>',
    '*should* encode characters in attribute values which cause parse errors, work, even though `allowParseErrors` mode is on'
  )

  assert.deepEqual(
    toHtml(s('circle', {title: "3'5"}), {
      space: 'svg',
      allowDangerousCharacters: true
    }),
    '<circle title="3\'5"></circle>',
    'should not encode characters which cause XSS issues in older browsers, in `allowDangerousCharacters` mode'
  )

  assert.deepEqual(
    toHtml(u('element', {tagName: 'circle', properties: {id: null}}, [])),
    '<circle></circle>',
    'should ignore attributes set to `null`'
  )

  assert.deepEqual(
    toHtml(u('element', {tagName: 'circle', properties: {id: undefined}}, [])),
    '<circle></circle>',
    'should ignore attributes set to `undefined`'
  )

  assert.deepEqual(
    toHtml(
      s(
        'svg',
        {
          xlmns: 'http://www.w3.org/2000/svg',
          xmlnsXLink: 'http://www.w3.org/1999/xlink',
          width: 500,
          height: 500,
          viewBox: [0, 0, 500, 500]
        },
        [
          s('title', 'SVG `<circle>` element'),
          s('circle', {cx: 120, cy: 120, r: 100})
        ]
      ),
      {space: 'svg'}
    ),
    [
      '<svg xlmns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewBox="0 0 500 500">',
      '<title>SVG `&#x3C;circle>` element</title>',
      '<circle cx="120" cy="120" r="100"></circle>',
      '</svg>'
    ].join(''),
    'should serialize an SVG tree'
  )

  assert.deepEqual(
    toHtml(
      h('div', [
        s(
          'svg',
          {
            xlmns: 'http://www.w3.org/2000/svg',
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
            viewBox: [0, 0, 8, 8]
          },
          [s('path', {stroke: 'blue', d: 'M0 6V3h1l1 1v2'})]
        )
      ])
    ),
    '<div><svg xlmns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 8 8"><path stroke="blue" d="M0 6V3h1l1 1v2"></path></svg></div>',
    'should serialize SVG props on an `svg` element in HTML'
  )

  assert.deepEqual(
    toHtml(
      u('root', [
        u('doctype', {name: 'html'}),
        h('head', h('title', 'The SVG `<circle>` element')),
        h('body', [
          s(
            'svg',
            {xlmns: 'http://www.w3.org/2000/svg', viewbox: [0, 0, 500, 500]},
            s('circle', {cx: 120, cy: 120, r: 100})
          )
        ])
      ])
    ),
    [
      '<!doctype html>',
      '<head><title>The SVG `&#x3C;circle>` element</title></head>',
      '<body>',
      '<svg xlmns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">',
      '<circle cx="120" cy="120" r="100"></circle>',
      '</svg>',
      '</body>'
    ].join(''),
    'should serialize an HTML tree with embedded HTML'
  )
})

function toString() {
  return 'yup'
}

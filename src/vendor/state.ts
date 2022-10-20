import { history } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { type EditorSelection, EditorState } from '@codemirror/state'
import { toCodeMirror } from './adapters/selections'
import { buildVendors } from '/src/extensions'
import { blockquote } from '/src/vendor/extensions/blockquote'
import { code } from '/src/vendor/extensions/code'
import { ink } from '/src/vendor/extensions/ink'
import { keymaps } from '/src/vendor/extensions/keymaps'
import { lineWrapping } from '/src/vendor/extensions/line_wrapping'
import { lists } from '/src/vendor/extensions/lists'
import { theme } from '/src/vendor/extensions/theme'
import { PluginType } from '/types/values'
import type * as Ink from '/types/ink'
import type InkInternal from '/types/internal'

const toVendorSelection = (selections: Ink.Editor.Selection[]): EditorSelection | undefined => {
  if (selections.length > 0)
    return toCodeMirror(selections)
}

export const makeState = (state: InkInternal.StateResolved): InkInternal.Vendor.State => {
  const extensions = state.options.plugins.flatMap(plugin => plugin.type === PluginType.Default ? plugin.value : [])
  const grammars = state.options.plugins.flatMap(plugin => plugin.type === PluginType.Grammar ? plugin.value : [])

  return EditorState.create({
    doc: state.options.doc,
    selection: toVendorSelection(state.options.selections),
    extensions: [
      ...buildVendors(state),
      blockquote(),
      code(),
      history(),
      ink(),
      keymaps(),
      lineWrapping(),
      lists(),
      markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        extensions: grammars,
      }),
      theme(),
      ...extensions,
    ],
  })
}

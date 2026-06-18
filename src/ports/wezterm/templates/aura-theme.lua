return {
  foreground = "{{ accent7 }}",
  background = "{{ accent12 }}",

  cursor_bg = "{{ uiAccentBright }}",
  cursor_fg = "{{ accent12 }}",
  cursor_border = "{{ uiAccentBright }}",

  selection_fg = "{{ accent7 }}",
  selection_bg = "{{ uiSelectionSolidBackground }}",

  scrollbar_thumb = "{{ uiSurfaceHover }}",
  split = "{{ uiWelcomeTileBorder }}",

  ansi = {
    "{{ ansiBlack }}",
    "{{ ansiRed }}",
    "{{ ansiGreen }}",
    "{{ ansiYellow }}",
    "{{ ansiBlue }}",
    "{{ ansiMagenta }}",
    "{{ ansiCyan }}",
    "{{ ansiWhite }}",
  },

  brights = {
    "{{ ansiBrightBlack }}",
    "{{ ansiBrightRed }}",
    "{{ ansiBrightGreen }}",
    "{{ ansiBrightYellow }}",
    "{{ ansiBrightBlue }}",
    "{{ ansiBrightMagenta }}",
    "{{ ansiBrightCyan }}",
    "{{ ansiBrightWhite }}",
  },

  indexed = {
    [16] = "{{ ansiDimBlack }}",
    [17] = "{{ ansiDimRed }}",
    [18] = "{{ ansiDimGreen }}",
    [19] = "{{ ansiDimYellow }}",
    [20] = "{{ ansiDimBlue }}",
    [21] = "{{ ansiDimMagenta }}",
    [22] = "{{ ansiDimCyan }}",
    [23] = "{{ ansiDimWhite }}",
  },

  compose_cursor = "{{ terminalPinkBright }}",
  copy_mode_active_highlight_bg = { Color = "{{ uiActionHoverBackground }}" },
  copy_mode_active_highlight_fg = { Color = "{{ uiActionHoverForeground }}" },
  copy_mode_inactive_highlight_bg = { Color = "{{ uiListSelectionBackground }}" },
  copy_mode_inactive_highlight_fg = { Color = "{{ accent7 }}" },
  quick_select_label_bg = { Color = "{{ uiAccentSoft }}" },
  quick_select_label_fg = { Color = "{{ accent12 }}" },
  quick_select_match_bg = { Color = "{{ uiActionHoverBackground }}" },
  quick_select_match_fg = { Color = "{{ uiActionHoverForeground }}" },

  tab_bar = {
    background = "{{ accent12 }}",
    active_tab = {
      bg_color = "{{ uiSurfacePanel }}",
      fg_color = "{{ accent7 }}",
      intensity = "Bold",
    },
    inactive_tab = {
      bg_color = "{{ accent12 }}",
      fg_color = "{{ accent10 }}",
    },
    inactive_tab_hover = {
      bg_color = "{{ uiSurfaceHover }}",
      fg_color = "{{ uiActionHoverBackground }}",
    },
    new_tab = {
      bg_color = "{{ accent12 }}",
      fg_color = "{{ accent10 }}",
    },
    new_tab_hover = {
      bg_color = "{{ uiSurfaceHover }}",
      fg_color = "{{ uiActionHoverBackground }}",
    },
  },
}

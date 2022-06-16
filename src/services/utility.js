class Utility {
  // eslint-disable-next-line
  getScanRules() {
    return [
      { value: 'accesskeys', description: 'Ensures every accesskey attribute value is unique' },
      { value: 'area-alt', description: 'Ensures <area> elements of image maps have alternate text' },
      { value: 'aria-allowed-attr', description: "Ensures ARIA attributes are allowed for an element's role" },
      { value: 'aria-allowed-role', description: 'Ensures role attribute has an appropriate value for the element' },
      { value: 'aria-command-name', description: 'Ensures every ARIA button, link and menuitem has an accessible name' },
      { value: 'aria-dialog-name', description: 'Ensures every ARIA dialog and alertdialog node has an accessible name' },
      { value: 'aria-hidden-body', description: "Ensures aria-hidden='true' is not present on the document body." },
      { value: 'aria-hidden-focus', description: 'Ensures aria-hidden elements do not contain focusable elements' },
      { value: 'aria-input-field-name', description: 'Ensures every ARIA input field has an accessible name' },
      { value: 'aria-meter-name', description: 'Ensures every ARIA meter node has an accessible name' },
      { value: 'aria-progressbar-name', description: 'Ensures every ARIA progressbar node has an accessible name' },
      { value: 'aria-required-attr', description: 'Ensures elements with ARIA roles have all required ARIA attributes' },
      { value: 'aria-required-children', description: 'Ensures elements with an ARIA role that require child roles contain them' },
      { value: 'aria-required-parent', description: 'Ensures elements with an ARIA role that require parent roles are contained by them' },
      { value: 'aria-roledescription', description: 'Ensure aria-roledescription is only used on elements with an implicit or explicit role' },
      { value: 'aria-roles', description: 'Ensures all elements with a role attribute use a valid value' },
      { value: 'aria-text', description: "Ensures 'role=text' is used on elements with no focusable descendants" },
      { value: 'aria-toggle-field-name', description: 'Ensures every ARIA toggle field has an accessible name' },
      { value: 'aria-tooltip-name', description: 'Ensures every ARIA tooltip node has an accessible name' },
      { value: 'aria-treeitem-name', description: 'Ensures every ARIA treeitem node has an accessible name' },
      { value: 'aria-valid-attr-value', description: 'Ensures all ARIA attributes have valid values' },
      { value: 'aria-valid-attr', description: 'Ensures attributes that begin with aria- are valid ARIA attributes' },
      { value: 'audio-caption', description: 'Ensures <audio> elements have captions' },
      { value: 'autocomplete-valid', description: 'Ensure the autocomplete attribute is correct and suitable for the form field' },
      { value: 'avoid-inline-spacing', description: 'Ensure that text spacing set through style attributes can be adjusted with custom stylesheets' },
      { value: 'blink', description: 'Ensures <blink> elements are not used' },
      { value: 'button-name', description: 'Ensures buttons have discernible text' },
      { value: 'bypass', description: 'Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content' },
      { value: 'color-contrast', description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds' },
      { value: 'css-orientation-lock', description: 'Ensures content is not locked to any specific display orientation, and the content is operable in all display orientations' },
      { value: 'definition-list', description: 'Ensures <dl> elements are structured correctly' },
      { value: 'dlitem', description: 'Ensures <dt> and <dd> elements are contained by a <dl>' },
      { value: 'document-title', description: 'Ensures each HTML document contains a non-empty <title> element' },
      { value: 'duplicate-id-active', description: 'Ensures every id attribute value of active elements is unique' },
      { value: 'duplicate-id-aria', description: 'Ensures every id attribute value used in ARIA and in labels is unique' },
      { value: 'duplicate-id', description: 'Ensures every id attribute value is unique' },
      { value: 'empty-heading', description: 'Ensures headings have discernible text' },
      { value: 'empty-table-header', description: 'Ensures table headers have discernible text' },
      { value: 'focus-order-semantics', description: 'Ensures elements in the focus order have an appropriate role' },
      { value: 'form-field-multiple-labels', description: 'Ensures form field does not have multiple label elements' },
      { value: 'frame-focusable-content', description: 'Ensures <frame> and <iframe> elements with focusable content do not have tabindex=-1' },
      { value: 'frame-tested', description: 'Ensures <iframe> and <frame> elements contain the axe-core script' },
      { value: 'frame-title-unique', description: 'Ensures <iframe> and <frame> elements contain a unique title attribute' },
      { value: 'frame-title', description: 'Ensures <iframe> and <frame> elements have an accessible name' },
      { value: 'heading-order', description: 'Ensures the order of headings is semantically correct' },
      { value: 'hidden-content', description: 'Informs users about hidden content.' },
      { value: 'html-has-lang', description: 'Ensures every HTML document has a lang attribute' },
      { value: 'html-lang-valid', description: 'Ensures the lang attribute of the <html> element has a valid value' },
      { value: 'html-xml-lang-mismatch', description: 'Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page' },
      { value: 'identical-links-same-purpose', description: 'identical-links-same-purpose' },
      { value: 'image-alt', description: 'Ensures <img> elements have alternate text or a role of none or presentation' },
      { value: 'image-redundant-alt', description: 'Ensure image alternative is not repeated as text' },
      { value: 'input-button-name', description: 'Ensures input buttons have discernible text' },
      { value: 'input-image-alt', description: "Ensures <input type='image'> elements have alternate text" },
      { value: 'label-content-name-mismatch', description: 'Ensures that elements labelled through their content must have their visible text as part of their accessible name' },
      { value: 'label-title-only', description: 'Ensures that every form element is not solely labeled using the title or aria-describedby attributes' },
      { value: 'label', description: 'Ensures every form element has a label' },
      { value: 'landmark-banner-is-top-level', description: 'Ensures the banner landmark is at top level' },
      { value: 'landmark-complementary-is-top-level', description: 'Ensures the complementary landmark or aside is at top level' },
      { value: 'landmark-contentinfo-is-top-level', description: 'Ensures the contentinfo landmark is at top level' },
      { value: 'landmark-main-is-top-level', description: 'Ensures the main landmark is at top level' },
      { value: 'landmark-no-duplicate-banner', description: 'Ensures the document has at most one banner landmark' },
      { value: 'landmark-no-duplicate-contentinfo', description: 'Ensures the document has at most one contentinfo landmark' },
      { value: 'landmark-no-duplicate-main', description: 'Ensures the document has at most one main landmark' },
      { value: 'landmark-one-main', description: 'Ensures the document has a main landmark' },
      { value: 'landmark-unique', description: 'Landmarks should have a unique role or role/label/title (i.e. accessible name) combination' },
      { value: 'link-in-text-block', description: 'Links can be distinguished without relying on color' },
      { value: 'link-name', description: 'Ensures links have discernible text' },
      { value: 'list', description: 'Ensures that lists are structured correctly' },
      { value: 'listitem', description: 'Ensures <li> elements are used semantically' },
      { value: 'marquee', description: 'Ensures <marquee> elements are not used' },
      { value: 'meta-refresh', description: "Ensures <meta http-equiv='refresh'> is not used" },
      { value: 'meta-viewport-large', description: "Ensures <meta name='viewport'> can scale a significant amount" },
      { value: 'meta-viewport', description: "Ensures <meta name='viewport'> does not disable text scaling and zooming" },
      { value: 'nested-interactive', description: 'Nested interactive controls are not announced by screen readers' },
      { value: 'no-autoplay-audio', description: 'Ensures <video> or <audio> elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio' },
      { value: 'object-alt', description: 'Ensures <object> elements have alternate text' },
      { value: 'p-as-heading', description: 'Ensure p elements are not used to style headings' },
      { value: 'page-has-heading-one', description: 'Ensure that the page, or at least one of its frames contains a level-one heading' },
      { value: 'presentation-role-conflict', description: 'Flags elements whose role is none or presentation and which cause the role conflict resolution to trigger.' },
      { value: 'region', description: 'Ensures all page content is contained by landmarks' },
      { value: 'role-img-alt', description: "Ensures [role='img'] elements have alternate text" },
      { value: 'scope-attr-valid', description: 'Ensures the scope attribute is used correctly on tables' },
      { value: 'scrollable-region-focusable', description: 'Elements that have scrollable content must be accessible by keyboard' },
      { value: 'select-name', description: 'Ensures select element has an accessible name' },
      { value: 'server-side-image-map', description: 'Ensures that server-side image maps are not used' },
      { value: 'skip-link', description: 'Ensure all skip links have a focusable target' },
      { value: 'svg-img-alt', description: 'Ensures svg elements with an img, graphics-document or graphics-symbol role have an accessible text' },
      { value: 'tabindex', description: 'Ensures tabindex attribute values are not greater than 0' },
      { value: 'table-duplicate-name', description: 'Ensure that tables do not have the same summary and caption' },
      { value: 'table-fake-caption', description: 'table-fake-caption' },
      { value: 'td-has-header', description: 'Ensure that each non-empty data cell in a large table has one or more table headers' },
      { value: 'td-headers-attr', description: 'Ensure that each cell in a table using the headers refers to another cell in that table' },
      { value: 'th-has-data-cells', description: 'Ensure that each table header in a data table refers to data cells' },
      { value: 'valid-lang', description: 'Ensures lang attributes have valid values' },
      { value: 'video-caption', description: 'Ensures <video> elements have captions' },
    ];
  }

  reviveUserAuditMetaFunction(data, vm) {
    // Starting at the top level, so the page was refreshed (User->meta)

    // Loop over every audit and check if meta property "sortedBy" is set
    const auditsMeta = Object.values(data.audit);
    const metaKeys = Object.keys(data.audit);
    for (let x = 0; x < auditsMeta.length; x += 1) {
      const val = auditsMeta[x];

      if (val.issues && val.issues.columns && val.issues.columns.sortedBy) {
        if (val.issues.columns.sortedBy.columns.includes('function')) {
          const index = val.issues.columns.sortedBy.columns.indexOf('function');
          const auditID = metaKeys[x];
          // Set the value of the actual meta within the user object in the global store
          vm.$store.state.auth.user.meta.audit[auditID].issues.columns.sortedBy.columns[index] = this.getSortValue(val.issues.columns.sortedBy.reference[index], vm);
        }
      }
    }
  }

  reviveAuditMetaFunction(metaData, vm) {
    if (metaData.issues
            && metaData.issues.columns
            && metaData.issues.columns.sortedBy
            && metaData.issues.columns.sortedBy.columns
            && metaData.issues.columns.sortedBy.columns.includes('function')) {
      for (let x = 0; x < metaData.issues.columns.sortedBy.columns.length; x += 1) {
        const column = metaData.issues.columns.sortedBy.columns[x];
        if (column === 'function') {
          metaData.issues.columns.sortedBy.columns[x] = this.getSortValue(metaData.issues.columns.sortedBy.reference[x], vm);
        }
      }
    }

    return metaData;
  }
  // eslint-disable-next-line
  getSortValue(column, vm) {
    let data = column;
    // String reference is necessary because sometimes our column becomes an anonymous function
    if (column === 'levels') {
      data = ((item) => item.levels.join(' '));
    }
    if (column === 'priority') {
      data = ((item) => {
        let output = '';
        switch (item.priority.toLowerCase()) {
          case 'critical':
            output = '1';
            break;
          case 'serious':
            output = '2';
            break;
          case 'moderate':
            output = '3';
            break;
          case 'minor':
            output = '4';
            break;
          default:
            output = '5';
            break;
        }
        return output;
      });
    }
    if (column === 'success_criteria') {
      data = ((item) => {
        let output = '';
        for (let x = 0; x < item.articles.length; x += 1) {
          const article = item.articles[x];
          output += ` ${article.display}`;
        }

        return output;
      });
    }
    if (column === 'techniques') {
      data = ((item) => {
        let output = '';
        for (let x = 0; x < item.techniques.length; x += 1) {
          const technique = item.techniques[x];
          output += technique.display;
        }
        return output;
      });
    }
    if (column === 'pages') {
      data = ((item) => {
        if (item.pages) {
          let domain = vm.$store.state.audits.audit.domain.url.replace(/\/$/gm, '');

          if (vm.$store.state.audits.audit.domain.root) {
            domain = `${domain}/${vm.$store.state.audits.audit.domain.root.replace(/\/$/gm, '')}`;
          }
          let output = '';
          for (let x = 0; x < item.pages.length; x += 1) {
            const page = item.pages[x];
            if (page.title) {
              output += page.title;
            }
            if (page.title && page.url) {
              output += ' - ';
            }
            if (page.url) {
              let { url } = page;
              if (url === '/') {
                url = '';
              }
              output += `${domain}/${url}`;
            }
          }

          return output;
        }
        return '';
      });
    }

    return data;
  }
  // eslint-disable-next-line
  convertHexToRgb(hex) {
    let r = 0; let g = 0; let
      b = 0;

    // 3 digits
    if (hex.length === 4) {
      r = `0x${hex[1]}${hex[1]}`;
      g = `0x${hex[2]}${hex[2]}`;
      b = `0x${hex[3]}${hex[3]}`;
    }

    // 6 digits
    if (hex.length === 7) {
      r = `0x${hex[1]}${hex[2]}`;
      g = `0x${hex[3]}${hex[4]}`;
      b = `0x${hex[5]}${hex[6]}`;
    }

    return `${r} ${g} ${b}`;
  }

  formatRGB(color) {
    const formatted = { r: '', g: '', b: '' };
    if (color.includes('#')) {
      color = this.convertHexToRgb(color);
    } else if (color.includes('rgb')) {
      // Color is in format rgb(255 255 255)
      color = color.replace('rgb(', '');
      color = color.replace(')', '');
    }

    const parts = color.split(' ');
    formatted.r = parseInt(parts[0], 16);
    formatted.g = parseInt(parts[1], 16);
    formatted.b = parseInt(parts[2], 16);

    return formatted;
  }

  computeRatio(fore, back) {
    const foreRGB = this.formatRGB(fore);
    const backRGB = this.formatRGB(back);
    // rgb = { r: "255" ... }

    const L1 = this.calculateLuminance(foreRGB.r, foreRGB.g, foreRGB.b);
    const L2 = this.calculateLuminance(backRGB.r, backRGB.g, backRGB.b);

    const brightest = Math.max(L1, L2);
    const darkest = Math.min(L1, L2);

    const ratio = (brightest + 0.05) / (darkest + 0.05);

    return parseFloat(ratio.toFixed(2));
  }
  // eslint-disable-next-line
  calculateLuminance(R8bit, G8bit, B8bit) {
    const RsRGB = R8bit / 255;
    const GsRGB = G8bit / 255;
    const BsRGB = B8bit / 255;

    const R = (RsRGB <= 0.03928) ? RsRGB / 12.92 : ((RsRGB + 0.055) / 1.055) ** 2.4;
    const G = (GsRGB <= 0.03928) ? GsRGB / 12.92 : ((GsRGB + 0.055) / 1.055) ** 2.4;
    const B = (BsRGB <= 0.03928) ? BsRGB / 12.92 : ((BsRGB + 0.055) / 1.055) ** 2.4;

    // For the sRGB colorspace, the relative luminance of a color is defined as:
    const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return L;
  }
}

export default new Utility();

class Daelog {
  constructor () {
    // Find the 'tw-storydata' element.
    const storydata = document.querySelector('tw-storydata');

    // Get the 'startnode' attribute. Save its 'value'.
    const startnode = storydata.attributes.startnode.value;

    // Find the element with a 'pid' of the startnode
    const passagedata = this.findPassageByPid(startnode);

    // Build a grammar
    const passages = document.querySelectorAll('tw-passagedata');

    const grammar = {};

    for (let i = 0; i < passages.length; i++) {
      const passage = passages[i];

      if (passage.hasAttribute('tags')) {
        if (passage.attributes.tags.value.includes('tracery')) {
          const name = passage.attributes.name.value;
          const array = passage.innerHTML.split('\n');
          grammar[name] = array;
        }
      }
    }

    window.tracery.grammar = window.tracery.createGrammar(grammar);

    // Show the passage matching the startnode
    this.showPassage(passagedata);
  }

  findPassageByPid (pid) {
  // Find the element by its 'pid'
    return document.querySelector(`[pid="${pid}"]`);
  }

  findPassageByName (name) {
    // Find the element by its 'name'
    return document.querySelector(`[name="${name}"]`);
  }

  showPassage (passagedata) {
    // Look for the 'tw-passage'
    let passage = document.querySelector('tw-passage');

    // If it is null, it does not exist yet
    if (passage === null) {
      // Create it
      passage = document.createElement('tw-passage');
    }

    // Save the passage contents
    let passageContents = passagedata.innerHTML;

    // Parse contents
    passageContents = this.parse(passageContents);

    // Append 'innerHTML' to parsed text
    passage.innerHTML += passageContents;

    // Find all links in the current passage
    const links = passage.querySelectorAll('a[data-passage]');

    // For each link, add an event listener
    for (const link of links) {
      // If a link is clicked...
      link.addEventListener('click', function (event) {
        // Get the name of the passage to load.
        const passagename = this.attributes['data-passage'].value;
        // Find the passage by its name
        const passagedata = window.daelog.findPassageByName(passagename);

        const choice = event.target.textContent;

        const choices = document.querySelector('.choices');
        choices.innerHTML = choice;
        choices.className = '';

        // Show the passage
        window.daelog.showPassage(passagedata);
      });
    }

    // Append the child element to the HTML <body>
    // (If it already exists, it will not be appended.)
    document.body.appendChild(passage);
  }

  parse (result) {
    // Look for &lt;
    // If found, convert into '<'
    result = result.replace(/&lt;/g, (match, target) => {
      return '<';
    });

    // Look for &gt;
    // If found, convert into '>'
    result = result.replace(/&gt;/g, (match, target) => {
      return '>';
    });

    // Look for \n
    // If found, convert into '<br>'
    result = result.replace(/\n/g, (match, target) => {
      return '<br>';
    });

    // Look for #content#
    // If found, convert it into Tracery grammar flatten
    result = result.replace(/#(.*?)#/g, (match, target) => {
      return window.tracery.grammar.flatten(match);
    });

    /* Classic [[links]]  */
    result = result.replace(/\[\[(.*?)\]\]/g, (match, target) => {
      var display = target;

      /* display|target format */
      var barIndex = target.indexOf('|');

      if (barIndex !== -1) {
        display = target.substr(0, barIndex);
        target = target.substr(barIndex + 1);
      } else {
        /* display->target format */
        const rightArrIndex = target.indexOf('->');

        if (rightArrIndex !== -1) {
          display = target.substr(0, rightArrIndex);
          target = target.substr(rightArrIndex + 2);
        } else {
          /* target<-display format */
          const leftArrIndex = target.indexOf('<-');

          if (leftArrIndex !== -1) {
            display = target.substr(leftArrIndex + 2);
            target = target.substr(0, leftArrIndex);
          }
        }
      }

      return '<a href="javascript:void(0)" data-passage="' +
                   target + '">' + display + '</a>';
    });

    // Create a DocumentFragment
    const fragment = new DocumentFragment();
    // Create a BODY
    const body = document.createElement('body');
    // Append the current contents
    body.innerHTML = result;
    fragment.append(body);

    let dialog = '';

    const originalLinks = fragment.querySelectorAll('a');
    const newLinks = [];

    // Clone the previous links into a new array
    for (const l of originalLinks) {
      newLinks.push(l.cloneNode(true));
      // Remove them from the DOM
      l.remove();
    }

    // Find all CHARACTER elements
    const characters = fragment.querySelectorAll('character');

    for (const char of characters) {
      // Pull the name attribute
      const name = char.attributes.name.value;
      // Pull the text content
      const textContent = char.textContent;

      // Is this "me"?
      if (name === 'me') {
        // Build a template literal string
        dialog += `
          <div class="container darker">
            <p>${textContent}</p>
            <div class="choices">`;

        // Write the links back into the element
        for (const l of newLinks) {
          dialog += `
            ${l.outerHTML}
            <br>`;
        }

        // Close the internal element
        dialog += `</div>
          </div>`;
      } else {
        // This was another character
        const response = window.tracery.grammar.flatten(`#${name}#`);

        dialog += `
          <div class="container">
            <p><strong>${name}</strong>: ${response}</p>
          </div>`;
      }

      char.remove();
    }

    result += dialog;

    // Look for <character> elements
    // If found, erase them. (They have already been parsed.)
    result = result.replace(/<character(.*?)>(.*?)<\/character>/g, (match, target) => {
      // Return an empty string
      return '';
    });

    return result;
  }
}

export default Daelog;

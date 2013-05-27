# ProferoTech.com

This is the public repo for ProferoTech.com, a website dedicated to promoting Profero's technical capabilities. It's hosted right here on github. Despite being open sourced, all content remains copyright of Profero.

&copy; 2013 Profero

[www.profero.com](http://www.profero.com)

---

[http://proferotech.com](http://proferotech.com)

Blog: [http://proferotech.com/blog](http://proferotech.com/blog/)

Jobs: [http://proferotech.com/blog/archive/](http://proferotech.com/jobs/)

comments are currenty disabled on the blog

---

Jobs Feed: [http://proferotech.com/feed/](http://proferotech.com/jobs/feed/)

Blog Feed: [http://proferotech.com/blog/feed/](http://proferotech.com/blog/feed/)

---

## Tech Specs

The site is a single static page, generated using Jekyll. There are currently 4 post types: 
* Work (detailing work items that we showcase on the home page)
* Testimonials (feedback from clients that we showcase on the home page)
* Jobs (positions available)
* Blog (blog posts)


There is no Front-End framework but it does use the [CSSWizardy grid system](https://github.com/csswizardry/csswizardry-grids). The CSS is compiled from [SASS](http://sass-lang.com/) with [Compass](http://compass-style.org/). The Front End build system is [Grunt](http://gruntjs.com), which concatonates, minifies, and compresses static assets.


### Features
* Responsive layout
* Generated content
* HTML5 geolocation
* HTML5 link & DNS prefetching
* Interactive Google map
* Icon font
* Only 1 image is used for the client logos, no images are used for any logos or icons
* Only 4 external CSS/JS files loaded in total (=fast)

### Compatibility
* Chrome
* Safari
* Firefox

#### Todo

* Improve content
* Add link to Chinese version
* Browser compatibility issues
* Implement unit tests

#### For Content Maintainers

All content for Work Items, Testimonials, and Job Postings is contained in the ```_posts```folder. Create the content in Markdown format, but be sure to keep the YAML front matter at the top of the file the same as other posts of the same type - just customise the variables and be sure to change the date. Markdown files must be saved in the format ```yyyy-mm-dd-slug.mdown```. If you save 2 files with the same date, the time must be different in the date variables in each file.

Changing any other content, adding new logos, or changing the number of work items will require code change.

#### For Contributing Developers

After cloning the repo, you'll need the following installed:

* node
* npm
* ruby
* jekyll
* grunt

then from inside the repo folder you can do:

```
npm install
```

To compile and watch SASS files during development, just do:

```
compass watch
```

To watch for changes to the CSS and JS files and prepare for production, just do:

```
grunt
```

You can then preview the site at [http://localhost:4000](http://localhost:4000) by doing:

```
jekyll --serve
```
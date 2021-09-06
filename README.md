# LAMBDA OMEGA CHAPTER

https://nushkn.org/index.html

At National University of Singapore the chapter of IEEE-HKN is named Lambda Omega. The Lambda Omega Chapter is the 176th chapter of IEEE-HKN founded on 2 February 2013.

The mission of the Lambda Omega Chapter is to provide special opportunities for close Faculty/Student interactions and relationships, and provide opportunities for students to develop life skills not taught in a formal class environment.


**Acknowledgements**:

	Demo Images:
		Unsplash (unsplash.com)

	Icons:
		Font Awesome (fontawesome.io)
		
	Web Previews:
		Netlify (www.netlify.com)

	Other:
		jQuery (jquery.com)
		Scrollex (github.com/ajlkn/jquery.scrollex)
		Responsive Tools (github.com/ajlkn/responsive-tools)
		

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"/>
</a>

## Technical details

This repository contains the code for the NUS IEEE HKN website. It is currently hosted on GitHub pages. The website uses Jekyll which supports Liquid, a templating language that can load dynamic content. This allows for some neat features, such as layouts. [From the Liquid documentation](https://jekyllrb.com/docs/layouts/):

> Layouts are templates that wrap around your content. They allow you to have the source code for your template in one place so you don’t have to repeat things like your navigation and footer on every page.

## Installation

To be able to test the site locally, Jekyll would have to be setup as per the instructions on [GitHub's own documentation](https://docs.github.com/en/github/working-with-github-pages/testing-your-github-pages-site-locally-with-jekyll).

1. [Follow the instructions to install Jekyll and its requirements here.](https://jekyllrb.com/docs/installation/) Note that Jekyll is a Ruby gem and requires a Ruby installation.
1. Open up a terminal and install bundler, also a Ruby gem.
	```
	$ gem install bundler
	```
1. Install all the required gems.
	```
	$ bundle install
	```
1. Run the site locally.
	```
	$ bundle exec jekyll serve
	```
1. The terminal should show the following if the installation is correct.
	```
	    Server address: http://127.0.0.1:4000/
  	  Server running... press ctrl-c to stop.
	```
1. Open up http://127.0.0.1:4000/ or http://localhost:4000/ on a browser to test the site.

## Usage

Take a look at the [Jekyll Step by Step Tutorial](https://jekyllrb.com/docs/step-by-step/01-setup/) to see the different aspects that can be used. Notably, there is currently a single default layout `_layouts/default.html` which removes the need for repeating the header and footer in every new webpage.
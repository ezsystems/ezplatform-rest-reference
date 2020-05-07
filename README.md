# eZ Platform REST reference

This repository contains the REST API reference for eZ Platform.
It is built based on RESTful API Modeling Language (RAML), for more information see <https://raml.org/>.

The repository is separated into three directories:

- input - RAML definitions and examples of HTTP methods used in eZ Platform
- output - static HTML automatically generated from RAML definitions
- raml2html - tool for generating static HTML from RAML definitions

## input

To document new REST API, you need to:
 
1. Add a new method with errors to `input/ez.raml`.
2. Add examples of request (e.g. `SectionInput.xml.example`) and response (e.g. `Section.xml.example`) to `input/examples`.
3. Update descriptions of request and response elements in `input/ez-types.raml`.

For detailed information on how to use RAML to document API, see [Specification.](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md)

## raml2html

To generate static HTML from RAML definitions, use the following code:

```sh
php raml2html/raml2html.php build --non-standard-http-methods=COPY,MOVE,PUBLISH,SWAP -t default -o output/ input/ez.raml 
```

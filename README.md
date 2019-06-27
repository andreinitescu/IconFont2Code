IconFont2Code
===================

This web tool generates a C# class with the Unicode values of the glyph icons in your font file (.ttf/.otf). 

It should be an useful tool for any .NET app (**WPF**/**UWP**/**Xamarin**/**Xamarin.Forms**) which uses icon fonts.

#### **See it live here**: https://andreinitescu.github.io/IconFont2Code/

Have questions or want to hear for updates on IconFont2Code? I'm on Twitter: https://twitter.com/nitescua

## How to use it

1. Pick a font (Browse from disk or just drag&drop the font file)
2. Click on "Copy to clipboard" button to copy the generated C# code
3. Paste the code in your .NET app

See an example with one of the "Font Awesome" fonts:

![](https://github.com/andreinitescu/IconFont2Code/blob/master/readmefiles/example1.gif)


## Generate nicer C# fields

When the font file has glyphs with generic names or the glyphs have no name, select the CSS file which is usually provided with the icon font, and the tool will generate nice names for your C# fields.

In the video below you can see the Foundation icons font which has glyph name in the form of "UniXXXXX":

(Click the thumbnail below to watch the video)
[![](https://github.com/andreinitescu/IconFont2Code/blob/master/readmefiles/example2.jpg)](https://youtu.be/HF6VLaAYSa4)

## Automagically use the CSS for certain fonts

IconFont2Code knows how to automatically select the right CSS file for certain known fonts. More fonts can be added easily by adding mapping info to [mappers.js](https://github.com/andreinitescu/IconFont2Code/blob/master/js/mappers.js). The 'name' field is the name of the font and the 'mappingUrl' is the URL of the CSS file. If you don't know how to do this by a pull-request, just open an issue.

## Like it?

Thanks! I hope it saved you some time. Don't forget to star the project here on GitHub, or feel free to [say hi](https://twitter.com/nitescua).

## Thanks to these awesome projects

* [OpenType.js](https://github.com/opentypejs/opentype.js)
* [KnockoutJS](https://knockoutjs.com/)
* [PrismJS](https://prismjs.com/)
* [ClipboardJS](https://clipboardjs)
* [Bootstrap](https://getbootstrap.com/)

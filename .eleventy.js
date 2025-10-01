const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
    // Copia la carpeta 'assets' al directorio de salida
    eleventyConfig.addPassthroughCopy("assets");

    // Crea una colección 'post', que ordena todos los artículos por fecha descendente
    eleventyConfig.addCollection("post", function (collectionApi) {
        return collectionApi.getFilteredByGlob("posts/**/*.md").sort(function (a, b) {
            return b.date - a.date;
        });
    });

    // Filtro para formatear fechas de manera legible
    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).setLocale('es').toLocaleString(DateTime.DATE_FULL);
    });

    return {
        dir: {
            input: ".",
            output: "_site" // La carpeta donde se generará el sitio final
        }
    };
};
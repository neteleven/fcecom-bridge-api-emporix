// Data received from /v3/catalog/products
module.exports.fetchProducts = {
    products: [
        {
            id: '00dd86a1-c4f2-4e17-a47a-64b7',
            yrn: 'urn:yaas:saasag:caasproduct:product:n11showcase;00dd86a1-c4f2-4e17-a47a-64b7',
            code: '8253-4720',
            name: { de: 'Châteauneuf-du-Pape', en: 'Châteauneuf-du-Pape' },
            description: {
                de: 'Châteauneuf-du-Pape ist ein berühmter Rotwein aus dem Rhône-Tal in Frankreich, der aus einer Mischung von Grenache, Syrah und Mourvèdre Trauben hergestellt wird. Der 2017er Jahrgang von Domaine de la Janasse ist ein exzellentes Beispiel für diese Art von Wein und bietet eine reiche, fruchtige Aromatik mit Noten von Kirschen, Pflaumen und Beeren, die von würzigen Nuancen von Pfeffer und Zimt abgerundet werden. Am Gaumen zeigt sich eine dichte Struktur, die von geschmeidigen Tanninen und einer angenehmen Säure getragen wird. Dieser Wein ist ein ausgezeichneter Begleiter zu Fleischgerichten, Wild oder kräftigem Käse.',
                en: 'Châteauneuf-du-Pape is a famous red wine from the Rhône Valley in France, made from a blend of Grenache, Syrah and Mourvèdre grapes. The 2017 vintage from Domaine de la Janasse is an excellent example of this type of wine and offers a rich, fruity aroma with notes of cherries, plums and berries, rounded off by spicy nuances of pepper and cinnamon. The palate reveals a dense structure supported by supple tannins and a pleasant acidity. This wine is an excellent accompaniment to meat dishes, game or strong cheeses.'
            },
            media: [[Object], [Object], [Object], [Object]],
            productType: 'BASIC',
            taxClasses: { DE: 'STANDARD_19' },
            mixins: { custom_product_attributes_n11: [Object] },
            published: true,
            metadata: {
                mixins: [Object],
                version: 1,
                createdAt: '2024-02-15T09:32:29.633Z',
                modifiedAt: '2024-02-15T09:32:29.633Z',
                schema: 'https://res.cloudinary.com/saas-ag/raw/upload/v1544786405/schemata/CAAS/product.v2'
            }
        },
        {
            id: '0197fa36-b965-4fb7-9ec9-0f42',
            yrn: 'urn:yaas:saasag:caasproduct:product:n11showcase;0197fa36-b965-4fb7-9ec9-0f42',
            code: '5995-6680',
            name: { de: 'Soave Klassisch', en: 'Soave Classic' },
            description: {
                de: 'Dieser Weißwein aus Italiens Soave Gebiet wird aus der Garganega Traube hergestellt und stammt vom Weingut Pieropan. Der Jahrgang 2020 zeigt eine helle strohgelbe Farbe und ein fruchtiges Aroma von Zitrusfrüchten und Pfirsichen. Am Gaumen ist er frisch und harmonisch mit einer leichten mineralischen Note und einem langen Abgang. Er eignet sich ideal als Aperitif oder Begleiter zu leichten Gerichten wie Fisch, Meeresfrüchten und Gemüse. Der Preis beträgt 20 Euro.',
                en: "This white wine from Italy's Soave region is made from the Garganega grape and comes from the Pieropan winery. The 2020 vintage has a light straw-yellow color and a fruity aroma of citrus fruits and peaches. It is fresh and harmonious on the palate with a light mineral note and a long finish. It is ideal as an aperitif or as an accompaniment to light dishes such as fish, seafood and vegetables. The price is 20 euros."
            },
            media: [[Object], [Object], [Object], [Object]],
            productType: 'BASIC',
            taxClasses: { DE: 'STANDARD_19' },
            mixins: { custom_product_attributes_n11: [Object] },
            published: true,
            metadata: {
                mixins: [Object],
                version: 1,
                createdAt: '2024-02-15T09:32:29.629Z',
                modifiedAt: '2024-02-15T09:32:29.629Z',
                schema: 'https://res.cloudinary.com/saas-ag/raw/upload/v1544786405/schemata/CAAS/product.v2'
            }
        }
    ],
    pagination: {
        currentPage: 0,
        pageSize: 60,
        sort: 'relevance',
        totalPages: 1,
        totalResults: 2
    }
};

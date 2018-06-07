'use strict';

System.register(['/public/app/core/table_model'], function (_export, _context) {
    "use strict";

    var TableModel;


    function transform(data, panel, model) {
        var i, y, z;
        for (i = 0; i < data.columns.length; i++) {
            model.columns.push({ text: data.columns[i].text });
        }

        if (model.columns.length === 0) {
            model.columns.push({ text: 'JSON' });
        }

        for (i = 0; i < data.rows.length; i++) {
            var values = [];
            var row = data.rows[i];
            if (data.columns.length > 0) {
                for (z = 0; z < data.columns.length; z++) {
                    values.push(row[data.columns[z].title]);
                }
            }
            model.rows.push(values);
        }
    }

    function transformDataToTable(data, panel) {
        var model = new TableModel();

        if (!data || data.length === 0) {
            return model;
        }

        transform(data, panel, model);
        return model;
    }

    return {
        setters: [function (_publicAppCoreTable_model) {
            TableModel = _publicAppCoreTable_model.default;
        }],
        execute: function () {
            _export('transformDataToTable', transformDataToTable);
        }
    };
});
//# sourceMappingURL=transformers.js.map

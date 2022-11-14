module.exports = {
  helpers: {
    dateTransfer: function (date) {
      return date.toISOString().slice(0, 10)
    },
    makeOptions: function (categories, selectedOption) {
      const options = categories.map(category => {
        if (selectedOption === category.name || selectedOption === category._id.toString()) {
          return `<option value='${category._id}' selected > ${category.name}</option >`
        }
        return `<option value='${category._id}'> ${category.name}</option >`
      }).join('')
      return options
    },
    ifCond: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this)
    }
  }
}
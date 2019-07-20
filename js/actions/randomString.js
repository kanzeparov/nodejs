'use strict'

module.exports = class RandomString {
  
 getRandomString(length) {
   let text = ''
   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

   for( let i=0; i < length; i++ )
     text += possible.charAt(Math.floor(Math.random() * possible.length))

   return text
  }
  
  response(ws, data) {
    if( data.length )
      ws.send( JSON.stringify({
        code: 200,
        message: 'OK',
        data: this.getRandomString(data.length)
      }) )
    else
      ws.send( JSON.stringify(errors['400']) )
  }
  
}

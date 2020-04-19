const mongoose = require('mongoose')
const { dbURI } = require('../config/environment')
const User = require('../models/User')
const Transfer = require('../models/Transfer')
const Club = require('../models/Club')

mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err, db) => {
    if (err) return console.log(err)
    db.dropDatabase()
      .then(() => {
        return Club.create([
          {
            imageUrl: 'placeholder',
            name: 'Manchester United',
            league: 'Premier League'
          },
          {
            imageUrl: 'placeholder',
            name: 'Chelsea',
            league: 'Premier League'
          },
          {
            imageUrl: 'placeholder',
            name: 'Salford Mariners F.C',
            league: 'National League North'
          },
          {
            imageUrl: 'placeholder',
            name: 'Broughton Rangers',
            league: 'Leicester & District Football League'
          }
        ])
      })
      .then(clubs => {
        console.log(`${clubs.length} clubs created. `)
        return clubs
      })
      .then(clubs => {
        return User.create([
          {
            firstName: 'Ron',
            lastName: 'Burgundy',
            username: 'ronb',
            email: 'ron@email.com',
            password: 'pass',
            passwordConfirmation: 'pass',
            imageUrl: 'https://vignette.wikia.nocookie.net/anchorman/images/1/10/Ron_burgundy.jpg/revision/latest/scale-to-width-down/340?cb=20120329160125',
            gender: 'Male',
            nationality: 'American',
            postCode: 'SG1 1BF',
            userType: 'Agent',
            agentData: {}
          },
          {
            firstName: 'Diego',
            lastName: 'Maradonna',
            username: 'diegom',
            email: 'diego@email.com',
            password: 'pass',
            passwordConfirmation: 'pass',
            imageUrl: 'https://ca-times.brightspotcdn.com/dims4/default/e1f2cd3/2147483647/strip/true/crop/1878x1056+0+0/resize/840x472!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fab%2F47%2F6263286c20a9c51801a04117b7e1%2Fla-1536343741-znwgxoschs-snap-image',
            gender: 'Male',
            nationality: 'Argentinean',
            postCode: 'SG1 1BF',
            userType: 'Official',
            officialData: {}
          },
          {
            firstName: 'Mr',
            lastName: 'Blobby',
            username: 'therealmrblobby',
            email: 'blobby@email.com',
            password: 'pass',
            passwordConfirmation: 'pass',
            imageUrl: 'https://www.expressandstar.com/resizer/iglE1ggIS9zCU0qPHC5x_V9ZoSk=/1000x0/filters:quality(100)/arc-anglerfish-arc2-prod-expressandstar-mna.s3.amazonaws.com/public/I4C4LXWYPVBJBGZ35TXKQYG2FI.jpg',
            gender: 'Male',
            nationality: 'British',
            postCode: 'SG1 1BF',
            userType: 'Player',
            playerData: {
              position: 'Midfield',
              height: 160,
              weight: 180,
              age: 31,
              agent: null,
              official: null,
              currentClub: null,
              league: 'Premier League',
              contractEnd: 'march 2022',
              type: 'Semi-Professional',
              price: 3000000,
              matchBonus: 10000,
              goalBonus: 10000
            }
          },
          {
            firstName: 'Asa',
            lastName: 'Noone',
            username: 'anoone',
            email: 'asa@email.com',
            password: 'pass',
            passwordConfirmation: 'pass',
            imageUrl: 'https://i.pinimg.com/474x/29/f1/e9/29f1e90af546f31116f14602a699b656.jpg',
            gender: 'Male',
            nationality: 'British',
            postCode: 'M6 7ja',
            userType: 'Player',
            playerData: {
              position: 'Striker',
              height: 160,
              weight: 180,
              age: 25,
              agent: null,
              official: null,
              currentClub: clubs[2],
              league: clubs[2].league,
              contractEnd: 'march 2022',
              type: 'Semi-Professional',
              price: 2000000,
              matchBonus: 5000,
              goalBonus: 1000
            }
          },
          {
            firstName: 'Louise',
            lastName: 'Noone',
            username: 'lnoone',
            email: 'louise@email.com',
            password: 'pass',
            passwordConfirmation: 'pass',
            imageUrl: 'https://i2-prod.mirror.co.uk/incoming/article7025788.ece/ALTERNATES/s1200b/Members-of-the-Lingerie-Football-League-UK.jpg',
            gender: 'Female',
            nationality: 'British',
            postCode: 'M6 7ja',
            userType: 'Player',
            playerData: {
              position: 'Defender',
              height: 160,
              weight: 180,
              age: 25,
              agent: null,
              official: null,
              currentClub: clubs[3],
              league: clubs[3].league,
              contractEnd: 'march 2022',
              type: 'Amateur',
              price: 2000000,
              matchBonus: 5000,
              goalBonus: 1000
            }
          }
        ])
          .then(users => {
            console.log(`${users.length} users created. `)
            //after users and clubs created, assign agent and official to player
            users[2].playerData.agent = users[0]
            users[2].playerData.official = users[1]
            //add players to agent and official
            users[0].agentData.players.push(users[2])
            users[0].agentData.players.push(users[3])
            //player actually isnt in a club yet so dont bother removing, just add to new
            clubs[0].players.push(users[2])
            clubs[0].save()
            //update players current club
            users[2].playerData.currentClub = clubs[0]
            //player.save() should only save once so wait until end of transfer
            // record transfer data
            const transferData = {
              player: users[2],
              agent: users[0],
              official: users[1],
              from: clubs[1],
              to: clubs[0],
              price: 1000000,
              matchBonus: 2000,
              goalBonus: 1000,
              type: 'Full Time',
              fee: 10000
            }
            return Transfer
              .create(transferData)
              .then(newTransfer => {
                console.log('transfer data created. ')
                // add record of transfer to each party
                //add to clubs
                clubs[1].transfers.push(newTransfer)
                clubs[1].save().catch(err => console.log('save error: ', err))
                clubs[0].transfers.push(newTransfer)
                clubs[0].save().catch(err => console.log('save error: ', err))
                // add to the agent
                users[0].transfers.push(newTransfer)
                users[0].save().catch(err => console.log('save error: ', err))
                // add to official
                users[1].transfers.push(newTransfer)
                users[1].save().catch(err => console.log('save error: ', err))
                //add to player
                users[2].transfers.push(newTransfer)
                users[2].save().catch(err => console.log('save error: ', err))
                  .finally(() => mongoose.connection.close())
              })
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      })
      .then(() => console.log('player transfered. '))
      .catch(err => console.log(err))
  })
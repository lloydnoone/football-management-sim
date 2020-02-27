const axios = require('axios')
const User = require('../models/User')

function index(req, res) {
  axios.all([
    axios.get(`http://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${process.env.AZID}&app_key=${process.env.AZKEY}&results_per_page=20&what=${req.params.title}&where=${req.params.location}&content-type=application/json`), //what=javascript%20developer need to regex this
    axios.get(`https://jobs.github.com/positions.json?description=${req.params.title}&location=${req.params.location}`), //&location=new+york need to regex this
    axios.get(`https://www.reed.co.uk/api/1.0/search?keywords=${req.params.title}&locationName=${req.params.location}`, {
      withCredentials: true,
      auth: {
        username: process.env.REEDUSER,
        password: ''
      }
    })
  ])
    .then(axios.spread((adzunaRes, githubRes, reedRes) => {
      console.log('mapping adzuna')
      const adzunaData = adzunaRes.data.results.map(job => {
        return ({
          id: job.id.toString(),
          title: job.title,
          location: job.location.display_name,
          company: job.company.display_name,
          minSalary: job.salary_min,
          maxSalary: job.salary_max,
          description: job.description,
          url: job.redirect_url 
        })
      })
      console.log('mapping github')
      const githubData = githubRes.data.map(job => {
        return ({
          id: job.id.toString(),
          title: job.title,
          location: job.location,
          company: job.company,
          minSalary: 'not',
          maxSalary: 'specified',
          description: job.description,
          url: job.company_url
        })
      })
      console.log('mapping reed')
      const reedData = reedRes.data.results.map(job => {
        return ({
          id: job.jobId.toString(),
          title: job.jobTitle,
          location: job.locationName,
          company: job.employerName,
          minSalary: job.minimumSalary,
          maxSalary: job.maximumSalary,
          description: job.jobDescription,
          url: job.jobUrl
        })
      })
      const jobsArray = [ ...adzunaData, ...githubData, ...reedData ]
      const jobsData = { jobsArray }
      console.log('sending jobs data')
      res.status(200).send(jobsData)
    }))
    .catch(err => {
      console.log(err.message)
      res.status(400).json(err)
    })
}

//job create /users/jobs
function jobCreate(req, res, next) {
  req.body.user = req.currentUser
  User
    .findById(req.body.user._id)
    .then(user => {
      if (!user) return res.status(404).json({ message: 'User not found' })
      user.jobs.push(req.body) // this might cause 422, check user Schema
      return user.save()
    })
    .then(user => res.status(201).json(user))
    .catch(next)
}

module.exports = {
  index,
  jobCreate
}
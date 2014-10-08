'use strict';
exports = module.exports = function(app) {
  if(app.config.queue.enabled) {
    var queue = require('bull');

    var defaultQueue = queue('default', app.config.queue.redis.port,
      app.config.queue.redis.host, {auth_pass: app.config.queue.redis.password});

    defaultQueue.process(function(job, done){
      // job.data contains the custom data passed when the job was created
      // job.jobId contains id of this job.

      // transcode video asynchronously and report progress
      job.progress(42);

      // call done when finished
      done();

      // or give a error if error
      done(Error('error transcoding'));

      // If the job throws an unhandled exception it is also handled correctly
      throw (Error('some unexpected error'));
    });

    // add Things to the queue
    // defaultQueue.add({ aKey: "aValue" });

    defaultQueue.on('completed', function(job){
      // Job completed!
    })
    .on('failed', function(job, err){
      // Job failed with reason err!
    })
    .on('progress', function(job, progress){
      // Job progress updated!
    })
    .on('paused', function(){
      // The queue has been paused
    })
    .on('resumed', function(job){
      // The queue has been resumed
    });

    //share the queues
    app.queues = {
      default: defaultQueue
    };
  }
};

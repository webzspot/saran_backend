
const prisma = require('../prisma')

const postSession = async (req, res) => {
    try {
        const data = req.body;

        const CardSession = await prisma.session.create({
            data: {
                session_image: req.file.location,
                session_name: data.session_name,
                session_mode: data.session_mode,
                price: data.price,
                description: data.description,
                date: data.date,
                time: data.time,
                session_platform: data.session_platform,
                session_kit: data.session_kit,
            },
        });

        res.json({ data: CardSession });
    } catch (error) {
        console.error("Error creating session:", error);
        res.json({
            message: "An error occurred while creating the session",
            error: error.message,
        });
    }
};

const postSessionDescription = async (req, res) => {
    try {
        const data = req.body;

        const SessionDescription = await prisma.sessiondescription.create({
            data: {
                language: data.language,
                kit_info: data.kit_info,
                learn1: data.learn1,
                learn2: data.learn2,
                learn3: data.learn3,
                other_benefits_1: data.other_benefits_1,
                other_benefits_2: data.other_benefits_2,
                other_benefits_3: data.other_benefits_3,
                session_id: data.session_id,
            },
        });

        res.status(200).json({
            SessionDescription,
        });
    } catch (error) {
        console.error("Error creating session description:", error);
        res.status(500).json({
            message: "An error occurred while creating the session description",
            error: error.message,
        });
    }
};

const getSession = async (req, res) => {
    
    try {
        const sessions = await prisma.session.findMany();
        res.json({
            data: {
                sessions,  
            }
        });
    } catch (error) {
        res.json({
            message: "An error occurred while fetching the sessions",
            error: error.message,
        });
    }
};



const getSessionById = async (req, res) => {
    try {
        const data = req.params;

        const paticularsection = await prisma.session.findUnique({
            where: {
                session_id: data.id,
            },
            include: {
                sessiondescription: true,
                Reviewsession: {
                    where: { isApproved: true}
                }
            }
            
        });

        res.status(200).json({
            paticularsection,
        });
    } catch (error) {
        console.error("Error fetching session by ID:", error);
        res.status(500).json({
            message: "An error occurred while fetching the session",
            error: error.message,
        });
    }
};

const postReviewSession = async (req, res) => {
    try {
      const { reviewer, rating, comment, session_id } = req.body;
  
      // Create a new review entry in the database
      const newReview = await prisma.reviewsession.create({
        data: {
          reviewer,
          rating,
          comment,
          session_id,
        },
      });
  
      res.status(201).json({
        message: "Review submitted successfully",
        data: newReview,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({
        message: "An error occurred while submitting the review",
        error: error.message,
      });
    }
  };
  
  // GET: Fetch all reviews for a session
  const getReviewSession = async (req, res) => {
    try {
  
      // Fetch reviews for the specified session and only return approved reviews
      const reviews = await prisma.reviewsession.findMany();
  
      res.status(200).json({
        message: "Reviews fetched successfully",
        data: reviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        message: "An error occurred while fetching reviews",
        error: error.message,
      });
    }
  };
  const deleteReviewSession = async (req, res) => {
    
    try {
        const { reviewSessionId } = req.params;
        
      // Fetch reviews for the specified session and only return approved reviews
      const deletereviews = await prisma.reviewsession.delete({
        where:{
            reviewsession_id:reviewSessionId
        }
      });
  
      res.status(200).json({
        message: "Review session deleted successfully.",
        data: deletereviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        message: "An error occurred while fetching reviews",
        error: error.message,
      });
    }
  };
  
  // UPDATE: Approve or edit a review
  const updateReviewSession = async (req, res) => {
    try {
      const { reviewSessionId } = req.params; // Review session ID to identify which review to update
      const { isApproved} = req.body;
  
      // Update the review details in the database
      const updatedReview = await prisma.reviewsession.update({
        where: {
          reviewsession_id: reviewSessionId,
        },
        data: {
          isApproved,
        },
      });
  
      res.status(200).json({
        message: "Review updated successfully",
        data: updatedReview,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({
        message: "An error occurred while updating the review",
        error: error.message,
      });
    }
  };

  const sessionDelete = async (req, res) => {
    try {
        const data = req.params;

        // Delete the session and include related data
        const sessiondelete = await prisma.session.delete({
            where: {
                session_id: data.id, // Assuming `id` is passed as a parameter in the URL
            },
            include: {
                sessiondescription: true,
                Reviewsession: {
                    where: { isApproved: true },
                },
            },
        });

        // Respond with success message and deleted session data
        res.json({
            message: "Session deleted successfully",
            sessiondelete,
        });
    } catch (error) {
        // Handle errors
        console.error("Error deleting session:", error);
        res.status(500).json({
            message: "An error occurred while deleting the session",
            error: error.message,
        });
    }
};

const sessionUpdate = async (req, res) => {
    try {
        const data = req.body;

        // Update session and related session description
        const sessionUpdate = await prisma.session.update({
            where: {
                session_id:data.session_id, // Unique identifier for the session
            },
            data: {
                session_image: req.file.location,
                session_name: data.session_name,
                session_mode: data.session_mode,
                price: data.price,
                description: data.description,
                date: data.date,
                time: data.time,
                session_platform: data.session_platform,
                session_kit: data.session_kit,
                sessiondescription: {
                    update: {
                        language: data.sessiondescription.language,
                        kit_info: data.sessiondescription.kit_info,
                        learn1: data.sessiondescription.learn1,
                        learn2: data.sessiondescription.learn2,
                        learn3: data.sessiondescription.learn3,
                        other_benefits_1: data.sessiondescription.other_benefits_1,
                        other_benefits_2: data.sessiondescription.other_benefits_2,
                        other_benefits_3: data.sessiondescription.other_benefits_3,
                    },
                },
            },
            include: {
                sessiondescription: true, // Include the related session description in the response
            },
        });

        res.json({
            message: "Session updated successfully",
            sessionUpdate,
        });
    } catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({
            message: "An error occurred while updating the session",
            error: error.message,
        });
    }
};

module.exports = {postSession,getSession,postSessionDescription,deleteReviewSession
    ,getSessionById,postReviewSession,getReviewSession,updateReviewSession,sessionDelete,sessionUpdate}
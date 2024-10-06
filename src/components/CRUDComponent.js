import React, { useState, useEffect } from "react";
import {
  fetchQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from "../services/api";
import {
  Table,
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";

const QuizCRUD = () => {
  const [quizzes, setQuizzes] = useState([]); // Menyimpan data quiz
  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    ans: "",
  }); // Menyimpan data form
  const [editingId, setEditingId] = useState(null); // Menyimpan ID yang sedang di-edit
  const [errors, setErrors] = useState({}); // Menyimpan pesan error
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" }); // Menyimpan alert

  // Memuat data dari API saat komponen pertama kali dirender
  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await fetchQuizzes();
      setQuizzes(response.data.quizzes || []); // Akses data dari response.data.quizzes
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  // Fungsi validasi form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.question) newErrors.question = "Question is required";
    if (!formData.option1) newErrors.option1 = "Option 1 is required";
    if (!formData.option2) newErrors.option2 = "Option 2 is required";
    if (!formData.option3) newErrors.option3 = "Option 3 is required";
    if (!formData.option4) newErrors.option4 = "Option 4 is required";
    if (!formData.ans || ![1, 2, 3, 4].includes(Number(formData.ans)))
      newErrors.ans = "Answer must be a number between 1 and 4";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Meng-handle perubahan input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Meng-handle form submit untuk menambahkan atau memperbarui quiz
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Validasi form

    try {
      if (editingId) {
        await updateQuiz(editingId, formData);
        setAlert({
          show: true,
          message: "Quiz updated successfully",
          variant: "success",
        });
      } else {
        await createQuiz(formData);
        setAlert({
          show: true,
          message: "Quiz created successfully",
          variant: "success",
        });
      }
      setFormData({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        ans: "",
      });
      setEditingId(null);
      loadQuizzes();
    } catch (error) {
      setAlert({
        show: true,
        message: "Error saving quiz",
        variant: "danger",
      });
      console.error("Error creating/updating quiz:", error);
    }
  };

  // Meng-handle edit quiz
  const handleEdit = (quiz) => {
    setFormData({
      question: quiz.question,
      option1: quiz.option1,
      option2: quiz.option2,
      option3: quiz.option3,
      option4: quiz.option4,
      ans: quiz.ans,
    });
    setEditingId(quiz.id); // Gunakan quiz.id sebagai editingId
  };

  // Meng-handle hapus quiz
  const handleDelete = async (id) => {
    try {
      await deleteQuiz(id);
      setAlert({
        show: true,
        message: "Quiz deleted successfully",
        variant: "success",
      });
      loadQuizzes();
    } catch (error) {
      setAlert({
        show: true,
        message: "Error deleting quiz",
        variant: "danger",
      });
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">Quiz CRUD with Axios</h1>

          {/* Alert for feedback */}
          {alert.show && (
            <Alert
              variant={alert.variant}
              onClose={() => setAlert({ ...alert, show: false })}
              dismissible
            >
              {alert.message}
            </Alert>
          )}

          {/* Form untuk menambah atau mengedit quiz */}
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group controlId="formQuestion">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                name="question"
                placeholder="Enter question"
                value={formData.question}
                onChange={handleChange}
                isInvalid={!!errors.question}
              />
              <Form.Control.Feedback type="invalid">
                {errors.question}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formOption1">
              <Form.Label>Option 1</Form.Label>
              <Form.Control
                type="text"
                name="option1"
                placeholder="Enter option 1"
                value={formData.option1}
                onChange={handleChange}
                isInvalid={!!errors.option1}
              />
              <Form.Control.Feedback type="invalid">
                {errors.option1}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formOption2">
              <Form.Label>Option 2</Form.Label>
              <Form.Control
                type="text"
                name="option2"
                placeholder="Enter option 2"
                value={formData.option2}
                onChange={handleChange}
                isInvalid={!!errors.option2}
              />
              <Form.Control.Feedback type="invalid">
                {errors.option2}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formOption3">
              <Form.Label>Option 3</Form.Label>
              <Form.Control
                type="text"
                name="option3"
                placeholder="Enter option 3"
                value={formData.option3}
                onChange={handleChange}
                isInvalid={!!errors.option3}
              />
              <Form.Control.Feedback type="invalid">
                {errors.option3}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formOption4">
              <Form.Label>Option 4</Form.Label>
              <Form.Control
                type="text"
                name="option4"
                placeholder="Enter option 4"
                value={formData.option4}
                onChange={handleChange}
                isInvalid={!!errors.option4}
              />
              <Form.Control.Feedback type="invalid">
                {errors.option4}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formAns">
              <Form.Label>Answer (1-4)</Form.Label>
              <Form.Control
                type="number"
                name="ans"
                placeholder="Enter correct answer"
                value={formData.ans}
                onChange={handleChange}
                isInvalid={!!errors.ans}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ans}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {editingId ? "Update" : "Create"}
            </Button>
          </Form>

          {/* Tabel untuk menampilkan daftar quiz */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Option 1</th>
                <th>Option 2</th>
                <th>Option 3</th>
                <th>Option 4</th>
                <th>Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={quiz.id}>
                  <td>{index + 1}</td>
                  <td>{quiz.question}</td>
                  <td>{quiz.option1}</td>
                  <td>{quiz.option2}</td>
                  <td>{quiz.option3}</td>
                  <td>{quiz.option4}</td>
                  <td>{quiz.ans}</td>
                  <td>
                    <Button
                      className="mb-2"
                      variant="warning"
                      onClick={() => handleEdit(quiz)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(quiz.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default QuizCRUD;

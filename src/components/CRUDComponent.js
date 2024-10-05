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
  const [quizzes, setQuizzes] = useState([]); // untuk menyimpan data yang kita ambil dari database
  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    ans: "",
  }); // untuk menyimpan inputan user
  const [editingId, setEditingId] = useState(null); // untuk menyimpan id yg dibawa
  const [errors, setErrors] = useState({}); // untuk menyimpan pesan validasi
  const [alert, setAlert] = useState({
    show: false,
    messsage: "",
    variant: "",
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await fetchQuizzes();
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error("error ketika mengambil data", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.question) newErrors.question = "Question is required";
    if (!formData.option1) newErrors.option1 = "Option 1 is required";
    if (!formData.option2) newErrors.option2 = "Option 2 is required";
    if (!formData.option3) newErrors.option3 = "Option 3 is required";
    if (!formData.option4) newErrors.option4 = "Option 4 is required";
    if (!formData.ans || ![1, 2, 3, 4].includes(Number(formData.ans)))
      newErrors.ans = "Jawaban harus antara 1 samapi 4";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   Mode Edit data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Mode input data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateQuiz(editingId, formData);
        setAlert({
          show: true,
          message: "Quiz berhasil diupdate",
          variant: "success",
        });
      } else {
        await createQuiz(formData);
        setAlert({
          show: true,
          message: "Quiz berhasil ditambahkan",
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
        message: "Gagal menyimpan atau mengedit quiz",
        variant: "danger",
      });
      console.error("Error menyimpan/mengupdate quiz", error);
    }
  };

  const handleEdit = (quiz) => {
    setFormData({
      question: quiz.question,
      option1: quiz.option1,
      option2: quiz.option2,
      option3: quiz.option3,
      option4: quiz.option4,
      ans: quiz.ans,
    });
    setEditingId(quiz.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuiz(id);
      setAlert({
        show: true,
        message: "Quiz berhasil dihapus",
        variant: "success",
      });
      loadQuizzes();
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal menghapus quiz",
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
          {alert.show && (
            <Alert
              variant={alert.variant}
              onClose={() => setAlert({ ...alert, show: false })}
              dismissible
            >
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group controlId="formQuestion">
              <Form.Label>Question</Form.Label>
              <Form.control
                type="text"
                name="question"
                placeholder="Masukkan Pertanyaan"
                value={formData.question}
                onChange={handleChange}
                isInvalid={!!errors.question}
              />
              <Form.Control.Feedback type="invalid">
                {errors.question}
              </Form.Control.Feedback>
            </Form.Group>
            {/* Input untuk option1 hingga 4 */}
            <Button variant="primary" type="submit" className="mt-3">
              {editingId ? "Update" : "Create"}
            </Button>
          </Form>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Question</th>
                <th>Option 1</th>
                <th>Option 2</th>
                <th>Option 3</th>
                <th>Option 4</th>
                <th>Answare</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>{quiz.question}</td>
                  <td>{quiz.option1}</td>
                  <td>{quiz.option2}</td>
                  <td>{quiz.option3}</td>
                  <td>{quiz.option4}</td>
                  <td>{quiz.answare}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(quiz)}>
                      Edit
                    </Button>
                    {""}
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

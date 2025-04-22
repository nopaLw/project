document.getElementById('callStudentButton').addEventListener('click', function() {
    const selectedStudent = document.getElementById('studentSelect').value;
    localStorage.setItem('calledStudent', selectedStudent);
    document.getElementById('teacherOutput').innerText = `Calling ${selectedStudent}...`;
});


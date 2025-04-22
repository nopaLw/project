window.onload = function() {
    const calledStudent = localStorage.getItem('calledStudent');
    if (calledStudent) {
        document.getElementById('studentStatus').innerText = `You have been called: ${calledStudent}`;
        localStorage.removeItem('calledStudent'); // Clear the called student after displaying
    }
};


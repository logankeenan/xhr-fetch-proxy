describe('xhr-fetch-proxy', function () {
    it('should POST the body data correctly', (done) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/post-data', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const testData = { message: 'Hello, Server!' };

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                expect(response.receivedData).toEqual(testData);
                done();
            } else {
                done.fail('Request failed');
            }
        };

        xhr.onerror = function() {
            done.fail('Request failed');
        };


        xhr.send(JSON.stringify(testData));
    });

    it('should follow redirect', (done) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/redirect', true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                expect(response.redirected).toBe(true);
                expect(response.message).toBe('Redirect successful');
                done();
            } else {
                done.fail('Request failed');
            }
        };

        xhr.onerror = function() {
            done.fail('Request failed');
        };

        xhr.send();
    });

    it('should handle text/html response correctly', (done) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/html', true);

        xhr.onload = function() {
            if (xhr.status === 200) {
                expect(xhr.responseText).toBe('<html><body><h1>Hello, World!</h1></body></html>');
                expect(xhr.getResponseHeader('content-type')).toBe('text/html; charset=utf-8');
                done();
            } else {
                done.fail('Request failed');
            }
        };

        xhr.onerror = function() {
            done.fail('Request failed');
        };

        xhr.send();
    });

    it('should handle abort correctly', (done) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost:3000/slow-response', true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 || xhr.readyState === 0) {
                expect(xhr.status).toBe(0);
                done()
            }
        };
        xhr.send();
        setTimeout(() => {
            xhr.abort();
        }, 100);
    });

    it('should set and get request headers correctly', (done) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/echo-headers', true);
        xhr.setRequestHeader('X-Custom-Header', 'TestValue');
        xhr.setRequestHeader('Another-Header', 'AnotherValue');

        xhr.onload = function() {
            const response = JSON.parse(xhr.responseText);
            expect(response['x-custom-header']).toBe('TestValue');
            expect(response['another-header']).toBe('AnotherValue');
            done();
        };

        xhr.send();
    });

    it('should handle different response types correctly', (done) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/blob-data', true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
            expect(xhr.response instanceof Blob).toBe(true);
            done();
        };

         xhr.send();
    });

    it('should trigger readystatechange events', (done) => {
        const xhr = new XMLHttpRequest();
        const states = [];

        xhr.onreadystatechange = function() {
            states.push(xhr.readyState);
            if (xhr.readyState === 4) {

                expect(states).toEqual([1, 2, 3, 4]);
                done();
            }
        };

        xhr.open('GET', 'http://localhost:3000/', true);
        setTimeout(() => {
            xhr.send();
        }, 100)

    });

    it('should get all response headers', (done) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/multiple-headers', true);

        xhr.onload = function() {
            expect(xhr.getResponseHeader('content-type')).toBe('application/json; charset=utf-8');
            expect(xhr.getResponseHeader('x-custom-header')).toBe('CustomValue');

            const allHeaders = xhr.getAllResponseHeaders();
            expect(allHeaders).toContain('content-type: application/json; charset=utf-8');
            expect(allHeaders).toContain('x-custom-header: CustomValue');
            done();
        };

        xhr.send();
    });
});
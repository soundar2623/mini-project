import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QR Code Scanner Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: QRScreen(),
    );
  }
}

class QRScreen extends StatefulWidget {
  @override
  _QRScreenState createState() => _QRScreenState();
}

class _QRScreenState extends State<QRScreen> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  String qrData = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('QR Code Scanner Demo'),
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            flex: 4,
            child: QRView(
              key: qrKey,
              onQRViewCreated: _onQRViewCreated,
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: Text('Scanned QR Code: $qrData'),
            ),
          ),
          Expanded(
            flex: 1,
            child: ElevatedButton(
              onPressed: () {
                if (qrData.isNotEmpty) {
                  authenticateUser(qrData);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Please scan a QR code first.'),
                    ),
                  );
                }
              },
              child: Text('Authenticate'),
            ),
          ),
        ],
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) {
      setState(() {
        qrData = scanData.code!;
      });
    });
  }

  void authenticateUser(String qrData) async {
    final response = await http.post(
      Uri.parse('http://192.168.1.38:5000/authenticate'), // Replace with your PC's IP
      body: {'qrData': qrData},
    );
    if (response.statusCode == 200) {
      print('Authentication successful');
      // Redirect to welcome page or handle other actions
    } else {
      print('Authentication failed');
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}

/**
 * PGP Verification Functions for CH Security Verification Center
 */

import * as openpgp from 'openpgp';

const CH_PUBLIC_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: E802 A6BF 8C2B 8ED7 1B9D  08FF C688 1736 D7BC 83D8
Comment: CHonesetDoPa <ch@nekoc.cc>

xlIEZqocZBMIKoZIzj0DAQcCAwRUyW13TRE5jBnvhkFo3WbS3njbb22juGI9ia5H
90UCHtsEDzTwsvkZnFfsV4IrEEC8azzPmD/ifpio2Dvfn0IYzRpDSG9uZXNldERv
UGEgPGNoQG5la29jLmNjPsKJBBMTCAAaBAsJCAcCFQgCFgECGQEFgmaqHGQCngEC
mwMAIQkQxogXNte8g9gWIQToAqa/jCuO1xudCP/GiBc217yD2Dc0AP9jxYPAMVEg
JBgAlZlfFgWemdJtDJnJUCgROshSC6H1iQEAkpl/Tz5sQvVdu58sN6Z6LdmyDohL
j7gaXepEn3ShR17OUgRmqhxkEwgqhkjOPQMBBwIDBFFPJVstKuaxyIkQcnL3HG6n
9kaXkkdsTyOI9S7Vc6wY8Ch+p7T7Rg2OZgAIv6pB9Jo24nKDUPIhtY21jkJzC8HC
eAQYEwgACQWCZqocZAKbIAAhCRDGiBc217yD2BYhBOgCpr+MK47XG50I/8aIFzbX
vIPYTfwBAOK1cFPGwCHXN/tpydhxm3wQkBCH0iah3EeBo12fLMl1AP4xPBiM/wqv
1oi3YUxBpVIpyTMpG0gaLyK/gGQoZzaiZc5WBGaqHGQSCCqGSM49AwEHAgMEcK2n
u/MGJIYVOBszdhxbQtIRRTvCXdYHc7Gru2NIsvkFpHMNk4LjQG0QFSA9iwziKy8g
lgUzwgLxQA4tyximMwMBCAfCeAQYEwgACQWCZqocZAKbDAAhCRDGiBc217yD2BYh
BOgCpr+MK47XG50I/8aIFzbXvIPYPn4BAIOCXyJ8zZKygwKXrW/2podRMyHUdQj9
rTIhezzgMAozAQCP8sakQCk8vXVKVyFBA1aTIe/Z0IzEACxx2HB3KpeXXA==
=cXbI
-----END PGP PUBLIC KEY BLOCK-----`;

/**
 * Verify PGP signature using OpenPGP.js
 */
async function verifyPGPSignature() {
    const messageInput = document.getElementById('message-input');
    const signatureInput = document.getElementById('signature-input');
    const resultDiv = document.getElementById('verification-result');
    
    const message = messageInput.value.trim();
    const signature = signatureInput.value.trim();
    
    // Clear previous results
    resultDiv.style.display = 'none';
    
    // Validate inputs
    if (!message) {
        showResult('error', '错误', '请输入要验证的原始消息');
        return;
    }
    
    if (!signature) {
        showResult('error', '错误', '请输入PGP签名');
        return;
    }
    
    if (!signature.includes('-----BEGIN PGP SIGNATURE-----')) {
        showResult('error', '格式错误', '签名格式不正确，应以 "-----BEGIN PGP SIGNATURE-----" 开头');
        return;
    }
    
    // Show loading state
    showResult('warning', '验证中...', '正在验证PGP签名，请稍候...');
    
    // Perform actual PGP verification
    try {
        await performRealVerification(message, signature);
    } catch (error) {
        showResult('error', '验证失败', `验证过程中出现错误: ${error.message}`);
    }
}

/**
 * Perform real PGP verification using OpenPGP.js
 */
async function performRealVerification(message, signature) {
    try {
        // Clean and validate inputs
        message = message.trim();
        signature = cleanSignatureText(signature);
        
        // Validate signature format
        if (!signature.includes('-----BEGIN PGP SIGNATURE-----') || 
            !signature.includes('-----END PGP SIGNATURE-----')) {
            throw new Error('无效的PGP签名格式');
        }
        
        // Parse the public key
        const publicKey = await openpgp.readKey({ armoredKey: CH_PUBLIC_KEY });
        
        // Create message object
        const messageObj = await openpgp.createMessage({ text: message });
        
        // Parse the signature with better error handling
        let signatureObj;
        try {
            signatureObj = await openpgp.readSignature({ armoredSignature: signature });
        } catch (sigError) {
            console.error('Signature parsing error:', sigError);
            throw new Error(`签名解析失败: ${sigError.message}`);
        }
        
        // Verify the signature
        const verificationResult = await openpgp.verify({
            message: messageObj,
            signature: signatureObj,
            verificationKeys: publicKey
        });
        
        // Check if signature is valid
        const { verified, keyID } = verificationResult.signatures[0];
        await verified; // This throws if verification fails
        
        // Get key information for display
        const keyInfo = publicKey.getKeyIDs()[0].toHex().toUpperCase();
        const userInfo = publicKey.getUserIDs()[0];
        
        showResult('success', '验证成功 ✓', 
                  `签名验证通过！此消息确实来自CH。<br>
                   <strong>验证时间:</strong> ${new Date().toLocaleString()}<br>
                   <strong>签名者:</strong> ${userInfo}<br>
                   <strong>密钥ID:</strong> ${keyInfo}<br>
                   <strong>级别:</strong> 可信任的签名`);
        
    } catch (error) {
        console.error('PGP Verification Error:', error);
        
        if (error.message.includes('Signature verification failed')) {
            showResult('error', '验证失败 ✗', 
                      `签名无效或不匹配。可能原因：<br>
                       • 消息内容已被修改<br>
                       • 签名不是由CH的密钥创建<br>
                       • 签名已损坏或不完整<br>
                       <strong>建议:</strong> 重新获取原始消息和签名`);
        } else if (error.message.includes('Could not find signing key with key ID')) {
            // Extract key ID from error message
            const keyIdMatch = error.message.match(/key ID ([a-fA-F0-9]+)/);
            const unknownKeyId = keyIdMatch ? keyIdMatch[1].toUpperCase() : '未知';
            
            showResult('error', '密钥不匹配 ✗', 
                      `此签名不是由CH的密钥创建！<br>
                       <strong>检测到的签名密钥ID:</strong> ${unknownKeyId}<br>
                       <strong>CH的密钥ID:</strong> C6881736D7BC83D8<br><br>
                       <strong>警告:</strong> 此签名来自其他人，可能存在身份冒充风险！<br>
                       <strong>建议:</strong> 仅信任由CH官方密钥签名的消息`);
        } else if (error.message.includes('Signed digest did not match')) {
            showResult('error', '签名验证失败 ✗', 
                      `消息与签名不匹配。可能原因：<br>
                       • 消息内容与签名时的原始内容不同<br>
                       • 消息中包含额外的空格、换行符或其他字符<br>
                       • 签名对应的是其他消息内容<br>
                       <strong>建议:</strong> 请确保消息内容与签名创建时完全一致，包括空格和换行符`);
        } else if (error.message.includes("Failed to execute 'atob'") || 
                   error.message.includes('The string to be decoded is not correctly encoded') ||
                   error.message.includes('Error during parsing') ||
                   error.message.includes('does not conform to a valid OpenPGP format') ||
                   error.message.includes('Unexpected end of packet')) {
            showResult('error', '签名格式错误 ✗', 
                      `签名内容不完整或格式错误。可能原因：<br>
                       • 签名被截断或复制不完整<br>
                       • 签名中包含无效字符<br>
                       • 签名的Base64编码已损坏<br>
                       • 缺少签名的结束标记<br>
                       • PGP签名格式不符合标准<br>
                       <strong>建议:</strong> 请重新复制完整的PGP签名，确保包含开始和结束标记`);
        } else if (error.message.includes('Invalid armor header')) {
            showResult('error', '格式错误', '签名格式不正确，请检查签名的完整性');
        } else {
            showResult('error', '验证失败', `验证过程中出现错误: ${error.message}`);
        }
    }
}



/**
 * Show verification result
 */
function showResult(type, title, message) {
    const resultDiv = document.getElementById('verification-result');
    resultDiv.className = `verification-result result-${type}`;
    resultDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
    `;
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Clear form inputs
 */
function clearForm() {
    document.getElementById('message-input').value = '';
    document.getElementById('signature-input').value = '';
    document.getElementById('verification-result').style.display = 'none';
}

/**
 * Download public key
 */
async function downloadPublicKey() {
    try {
        // Validate the public key before downloading
        await openpgp.readKey({ armoredKey: CH_PUBLIC_KEY });
        
        // Create a blob with the public key
        const keyBlob = new Blob([CH_PUBLIC_KEY], { type: 'text/plain' });
        const url = URL.createObjectURL(keyBlob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ch-public-key.asc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show notification with key info
        const publicKey = await openpgp.readKey({ armoredKey: CH_PUBLIC_KEY });
        const keyInfo = publicKey.getKeyIDs()[0].toHex().toUpperCase();
        const userInfo = publicKey.getUserIDs()[0];
        
        showResult('success', '下载完成', 
                  `CH的PGP公钥已下载成功！<br>
                   <strong>密钥信息:</strong><br>
                   用户ID: ${userInfo}<br>
                   密钥ID: ${keyInfo}<br>
                   <strong>使用方法:</strong>请将下载的密钥文件导入到您的PGP软件中进行验证。`);
                   
    } catch (error) {
        showResult('error', '下载失败', `无法下载公钥: ${error.message}`);
    }
}

/**
 * Show public key information
 */
async function showPublicKeyInfo() {
    try {
        const publicKey = await openpgp.readKey({ armoredKey: CH_PUBLIC_KEY });
        const keyInfo = publicKey.getKeyIDs()[0].toHex().toUpperCase();
        const userInfo = publicKey.getUserIDs()[0];
        const creationTime = publicKey.getCreationTime();
        
        showResult('success', '公钥信息', 
                  `<strong>CH的PGP公钥信息:</strong><br>
                   用户ID: ${userInfo}<br>
                   密钥ID: ${keyInfo}<br>
                   创建时间: ${creationTime.toLocaleString()}<br>
                   算法: ${publicKey.getAlgorithmInfo().algorithm}<br>
                   <strong>指纹:</strong> ${publicKey.getFingerprint()}`);
                   
    } catch (error) {
        showResult('error', '无法获取公钥信息', `错误: ${error.message}`);
    }
}



/**
 * Initialize page and validate public key
 */
async function initializePage() {
    // Validate public key on page load
    try {
        const publicKey = await openpgp.readKey({ armoredKey: CH_PUBLIC_KEY });
        const keyInfo = publicKey.getKeyIDs()[0].toHex().toUpperCase();
        const userInfo = publicKey.getUserIDs()[0];
        console.log(`✓ Public key loaded successfully - User: ${userInfo}, Key ID: ${keyInfo}`);
    } catch (error) {
        console.error('✗ Error loading public key:', error);
        showResult('error', '公钥加载失败', `公钥格式错误或损坏: ${error.message}`);
        return;
    }
}



// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

/**
 * Import .sig file functionality
 */
function importSigFile() {
    const fileInput = document.getElementById('sig-file-input');
    fileInput.click();
}

/**
 * Handle .sig file import
 */
async function handleSigFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        console.log(`Processing file: ${file.name} (${file.size} bytes)`);
        
        // Determine file type based on extension and content
        const isKeyFile = isKeyFileExtension(file.name);
        const isSignatureFile = isSignatureFileExtension(file.name);
        
        let content;
        
        if (isKeyFile) {
            // Handle key files (for future key management)
            content = await readFileWithEncoding(file);
            content = cleanSignatureText(content);
            
            if (content.includes('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
                showResult('info', '密钥文件检测', '检测到PGP公钥文件。当前版本使用内置密钥进行验证。');
                return;
            } else {
                throw new Error('无效的密钥文件格式');
            }
            
        } else if (isSignatureFile) {
            // Handle signature files (.sig, .asc with signature)
            const arrayBuffer = await readFileAsArrayBuffer(file);
            content = await convertBinaryToArmored(arrayBuffer);
            
            const parsed = parseSigFile(content, file.name);
            
            if (parsed.signature) {
                document.getElementById('signature-input').value = parsed.signature;
            }
            if (parsed.message) {
                document.getElementById('message-input').value = parsed.message;
            }
            
            showImportResult(file, 'signature', parsed);
            
        } else {
            // Handle source files (documents to be verified)
            const arrayBuffer = await readFileAsArrayBuffer(file);
            const textContent = new TextDecoder('utf-8').decode(arrayBuffer);
            
            // Check if it contains a signature (signed document)
            if (textContent.includes('-----BEGIN PGP SIGNATURE-----')) {
                // It's a signed document - parse both message and signature
                const parsed = parseSigFile(textContent, file.name);
                
                if (parsed.message) {
                    document.getElementById('message-input').value = parsed.message;
                }
                if (parsed.signature) {
                    document.getElementById('signature-input').value = parsed.signature;
                }
                
                showImportResult(file, 'signed_document', parsed);
            } else {
                // It's a source document - put content in message box
                document.getElementById('message-input').value = textContent;
                
                showResult('success', '源文件导入成功', 
                    `已导入文件内容到消息框: ${file.name} (${(file.size/1024).toFixed(1)}KB)\n请单独导入对应的签名文件到签名框`);
            }
        }
        
    } catch (error) {
        console.error('Error importing file:', error);
        showResult('error', '文件导入失败', `无法读取文件 ${file.name}: ${error.message}`);
    }
    
    // Clear the input for next use
    event.target.value = '';
}

/**
 * Read file as text with encoding detection
 */
function readFileWithEncoding(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            let text = e.target.result;
            // Clean up common encoding issues
            text = text.replace(/^\uFEFF/, ''); // Remove BOM
            resolve(text);
        };
        reader.onerror = () => reject(new Error('无法读取文件'));
        // Try UTF-8 first
        reader.readAsText(file, 'UTF-8');
    });
}

/**
 * Read file as text (fallback method)
 */
function readFileAsText(file) {
    return readFileWithEncoding(file);
}

/**
 * Read file as array buffer
 */
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('无法读取二进制文件'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Convert binary signature to armored format
 */
async function convertBinaryToArmored(arrayBuffer) {
    try {
        // First try to parse as binary PGP signature
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Check if it's actually a binary signature (starts with specific bytes)
        if (uint8Array[0] === 0x01 || uint8Array[0] === 0x02 || 
            (uint8Array[0] & 0x80) !== 0) {
            // This looks like binary PGP data
            console.log('Detected binary PGP signature, converting...');
            const signature = await openpgp.readSignature({ 
                binarySignature: uint8Array 
            });
            const armored = signature.armor();
            return cleanSignatureText(armored);
        } else {
            // Might be text stored as binary, try to decode
            console.log('Binary data might be text, trying to decode...');
            const text = new TextDecoder('utf-8').decode(arrayBuffer);
            if (text.includes('-----BEGIN PGP SIGNATURE-----')) {
                console.log('Found armored signature in binary data');
                return cleanSignatureText(text);
            } else {
                throw new Error('Binary data does not contain recognizable PGP signature');
            }
        }
    } catch (error) {
        console.warn('Binary conversion failed:', error);
        // Try as text fallback
        const text = new TextDecoder('utf-8').decode(arrayBuffer);
        if (text.includes('-----BEGIN PGP SIGNATURE-----')) {
            console.log('Fallback: treating as text signature');
            return cleanSignatureText(text);
        }
        throw new Error(`无法解析文件内容: ${error.message}`);
    }
}

/**
 * Clean and validate signature text
 */
function cleanSignatureText(text) {
    // Remove BOM and normalize line endings
    let cleaned = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Ensure proper PGP signature format
    if (cleaned.includes('-----BEGIN PGP SIGNATURE-----') && cleaned.includes('-----END PGP SIGNATURE-----')) {
        // Extract just the signature block
        const startIndex = cleaned.indexOf('-----BEGIN PGP SIGNATURE-----');
        const endIndex = cleaned.indexOf('-----END PGP SIGNATURE-----') + '-----END PGP SIGNATURE-----'.length;
        cleaned = cleaned.substring(startIndex, endIndex);
        
        // Split into lines for proper formatting
        const lines = cleaned.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        // Reconstruct with proper format
        let result = '';
        let inHeader = true;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line === '-----BEGIN PGP SIGNATURE-----') {
                result += line + '\n';
                inHeader = true;
            } else if (line === '-----END PGP SIGNATURE-----') {
                result += line;
                inHeader = false;
            } else if (inHeader && line.includes(':')) {
                // This is a header line (like Version: GnuPG)
                result += line + '\n';
            } else if (inHeader && !line.includes(':')) {
                // First data line - add blank line before it
                result += '\n' + line + '\n';
                inHeader = false;
            } else {
                // Regular data line
                result += line + '\n';
            }
        }
        
        cleaned = result.trim();
    }
    
    return cleaned;
}

/**
 * Check if file extension indicates a key file
 */
function isKeyFileExtension(fileName) {
    const name = fileName.toLowerCase();
    return name.includes('key') || name.includes('pub') || 
           (name.endsWith('.asc') && (name.includes('key') || name.includes('pub')));
}

/**
 * Check if file extension indicates a signature file
 */
function isSignatureFileExtension(fileName) {
    const name = fileName.toLowerCase();
    return name.endsWith('.sig') || name.endsWith('.pgp') || 
           (name.endsWith('.asc') && !name.includes('key') && !name.includes('pub'));
}

/**
 * Show import result with detailed info
 */
function showImportResult(file, type, parsed) {
    const fileSize = `${file.name} (${(file.size/1024).toFixed(1)}KB)`;
    
    switch(type) {
        case 'signature':
            const messageInfo = parsed.message ? '包含原始消息' : '仅包含签名';
            const signatureValid = parsed.signature && 
                                  parsed.signature.includes('-----BEGIN PGP SIGNATURE-----') && 
                                  parsed.signature.includes('-----END PGP SIGNATURE-----');
            
            const hasBlankLine = parsed.signature && (
                parsed.signature.includes('-----BEGIN PGP SIGNATURE-----\n\n') ||
                parsed.signature.match(/-----BEGIN PGP SIGNATURE-----\n[^-\n]*:\s*[^\n]*\n\n/)
            );
            
            let statusMsg = `已导入签名文件: ${fileSize}\n${messageInfo}`;
            if (signatureValid) {
                statusMsg += '\n✓ 签名格式有效';
                statusMsg += hasBlankLine ? '\n✓ 格式符合OpenPGP标准' : '\n✓ 格式已自动修正';
            } else {
                statusMsg += '\n⚠ 签名格式可能有问题';
            }
            
            showResult('success', '签名文件导入成功', statusMsg);
            break;
            
        case 'signed_document':
            const hasMessage = !!parsed.message;
            const hasSignature = !!parsed.signature;
            
            let docMsg = `已导入签名文档: ${fileSize}`;
            if (hasMessage) docMsg += '\n✓ 消息内容已填入';
            if (hasSignature) docMsg += '\n✓ 签名已填入';
            
            showResult('success', '签名文档导入成功', docMsg);
            break;
    }
}
function parseSigFile(content, fileName = '') {
    const result = {
        message: '',
        signature: ''
    };
    
    // Clean the content first
    content = cleanSignatureText(content);
    
    // For .sig files (detached signatures), content is usually just the signature
    if (fileName.endsWith('.sig') || fileName.endsWith('.pgp')) {
        // Detached signature - only signature, no original message
        if (content.includes('-----BEGIN PGP SIGNATURE-----')) {
            result.signature = content;
        } else {
            // If it's a .sig file but doesn't contain armored signature,
            // it might be raw binary that wasn't converted properly
            throw new Error('签名文件格式无效或无法识别');
        }
    } else {
        // For .asc files or other formats, try to parse both message and signature
        const sigStart = content.indexOf('-----BEGIN PGP SIGNATURE-----');
        const sigEnd = content.indexOf('-----END PGP SIGNATURE-----');
        
        if (sigStart !== -1 && sigEnd !== -1) {
            // Extract signature
            result.signature = content.substring(sigStart, sigEnd + '-----END PGP SIGNATURE-----'.length);
            
            // Extract message (everything before the signature)
            if (sigStart > 0) {
                result.message = content.substring(0, sigStart).trim();
            }
        } else if (content.includes('-----BEGIN PGP SIGNATURE-----')) {
            // Just signature, no message
            result.signature = content;
        } else {
            // If no signature found, treat entire content as message
            result.message = content.trim();
        }
    }
    
    return result;
}

// Expose functions to global scope for HTML onclick handlers
window.verifyPGPSignature = verifyPGPSignature;
window.clearForm = clearForm;
window.downloadPublicKey = downloadPublicKey;
window.showPublicKeyInfo = showPublicKeyInfo;
window.importSigFile = importSigFile;
window.handleSigFileImport = handleSigFileImport;
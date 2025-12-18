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
        // Parse the public key
        const publicKey = await openpgp.readKey({ armoredKey: CH_PUBLIC_KEY });
        
        // Create message object
        const messageObj = await openpgp.createMessage({ text: message });
        
        // Parse the signature
        const signatureObj = await openpgp.readSignature({ armoredSignature: signature });
        
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

// Expose functions to global scope for HTML onclick handlers
window.verifyPGPSignature = verifyPGPSignature;
window.clearForm = clearForm;
window.downloadPublicKey = downloadPublicKey;
window.showPublicKeyInfo = showPublicKeyInfo;
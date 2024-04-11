import * as vscode from 'vscode';
import * as util from './utilities';
import * as state from './state';
import { NReplSession } from './nrepl';
import * as replSession from './nrepl/repl-session';
import { appendLineEvalOut } from './results-output/output';

function report(res) {
  if (res.status == 'ok') {
    appendLineEvalOut('Reloaded: (' + res.reloaded.join(' ') + ')');
    appendLineEvalOut(':ok');
  } else {
    if (res.status == 'error') {
      appendLineEvalOut('Error reloading: ' + res.errorNs);
      //chan.appendLine(res.error); // TODO: Moar error reporting
    }
    if (res.err != undefined) {
      appendLineEvalOut(res.err);
    }
    appendLineEvalOut(':error 😿');
  }
}

function refresh(document = {}) {
  const doc = util.tryToGetDocument(document),
    client: NReplSession = replSession.getSession(util.getFileType(doc));

  if (client != undefined) {
    appendLineEvalOut('Reloading...');
    void client.refresh().then((res) => {
      report(res);
    });
  } else {
    void vscode.window.showErrorMessage('Not connected to a REPL.');
  }
}

function refreshAll(document = {}) {
  const doc = util.tryToGetDocument(document),
    client: NReplSession = replSession.getSession(util.getFileType(doc));

  if (client != undefined) {
    appendLineEvalOut('Reloading all the things...');
    void client.refreshAll().then((res) => {
      report(res);
    });
  } else {
    void vscode.window.showErrorMessage('Not connected to a REPL.');
  }
}

export default {
  refresh,
  refreshAll,
};
